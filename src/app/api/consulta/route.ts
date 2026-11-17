import { NextRequest, NextResponse } from 'next/server';
import { findPosRecord, getPdrData } from '@/lib/googleSheets';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pos = searchParams.get('pos');

    // Case 1: No POS query param provided -> Return classified count only
    if (!pos) {
      const { classifiedCount } = await getPdrData();
      return NextResponse.json(
        { classifiedCount },
        {
          status: 200,
          headers: {
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
          },
        }
      );
    }

    // Case 2: Validation of 8 digits
    const trimmed = pos.trim();
    const posRegex = /^\d{8}$/;
    if (!posRegex.test(trimmed)) {
      const { classifiedCount } = await getPdrData();
      return NextResponse.json(
        {
          classifiedCount,
          error: 'INVALID_POS',
          message: 'El código POS debe contener exactamente 8 dígitos numéricos.',
        },
        { status: 400 }
      );
    }

    // Case 3: Search POS in dataset
    const { record, classifiedCount } = await findPosRecord(trimmed);

    if (!record) {
      return NextResponse.json(
        {
          classifiedCount,
          error: 'POS_NOT_FOUND',
          message: 'No encontramos el POS ingresado en la cartera activa de M&M Comunicaciones.',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        classifiedCount,
        record,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
        },
      }
    );
  } catch (error) {
    console.error('API Error in /api/consulta:', error);
    return NextResponse.json(
      {
        error: 'INTERNAL_SERVER_ERROR',
        message: 'Ocurrió un error al consultar los datos del servidor.',
      },
      { status: 500 }
    );
  }
}
