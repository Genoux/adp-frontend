import { NextRequest, NextResponse } from "next/server";

export const config = {
  runtime: 'edge',
}

const handler = async (req: NextRequest) => {
  return NextResponse.json({
    message: 'Hello World',
  })
}

export default handler