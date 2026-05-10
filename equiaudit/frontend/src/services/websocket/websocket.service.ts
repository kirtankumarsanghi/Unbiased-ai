// WebSocket service logic
type MessageHandler = (
  data: unknown
) => void;

class WebSocketService {
  private socket: WebSocket | null =
    null;

  connect(
    url: string,
    onMessage: MessageHandler
  ) {
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log(
        "WebSocket connected"
      );
    };

    this.socket.onmessage = (
      event
    ) => {
      const data = JSON.parse(
        event.data
      );

      onMessage(data);
    };

    this.socket.onclose = () => {
      console.log(
        "WebSocket disconnected"
      );
    };
  }

  send(data: unknown) {
    if (
      this.socket &&
      this.socket.readyState ===
        WebSocket.OPEN
    ) {
      this.socket.send(
        JSON.stringify(data)
      );
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
    }
  }
}

export const websocketService =
  new WebSocketService();