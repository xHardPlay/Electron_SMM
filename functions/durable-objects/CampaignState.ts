export class CampaignState {
  state: DurableObjectState;

  constructor(state: DurableObjectState) {
    this.state = state;
  }

  async fetch(request: Request) {
    const url = new URL(request.url);

    if (request.method === 'POST' && url.pathname === '/store') {
      const data = await request.json();
      await this.state.storage.put('campaignData', data);
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (request.method === 'GET' && url.pathname === '/retrieve') {
      const data = await this.state.storage.get('campaignData');
      return new Response(JSON.stringify(data || {}), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response('Not found', { status: 404 });
  }
}
