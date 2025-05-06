import { NextResponse } from 'next/server';

export function middleware(request) {
  console.log(`API appelée: ${request.nextUrl.pathname}`);
  return NextResponse.next();
}
