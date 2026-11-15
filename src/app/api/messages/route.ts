import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const TMP_FILE = path.join(process.platform === 'win32' ? process.cwd() : '/tmp', 'nerdy_messages.json');

// Memory cache fallback
let memoryMessages: Record<string, unknown[]> = {};

function loadMessages(): Record<string, unknown[]> {
  try {
    if (fs.existsSync(TMP_FILE)) {
      const data = fs.readFileSync(TMP_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch {
    // ignore
  }
  return memoryMessages;
}

function saveMessages(data: Record<string, unknown[]>) {
  memoryMessages = data;
  try {
    fs.writeFileSync(TMP_FILE, JSON.stringify(data), 'utf-8');
  } catch {
    // ignore
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const channelId = searchParams.get('channelId') || 'c-general';

  const all = loadMessages();
  const channelMsgs = all[channelId] || [];

  return NextResponse.json({
    channelId,
    messages: channelMsgs,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { channelId, message } = body;

    if (!channelId || !message) {
      return NextResponse.json({ error: 'Missing channelId or message' }, { status: 400 });
    }

    const all = loadMessages();
    if (!all[channelId]) {
      all[channelId] = [];
    }

    all[channelId].push(message);
    saveMessages(all);

    return NextResponse.json({ success: true, message });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save message' }, { status: 500 });
  }
}
