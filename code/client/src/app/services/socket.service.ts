import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;
  private readonly backendUrl = "http://localhost:5000"

  constructor() {
    this.socket = io(this.backendUrl)
  }

  register(userId: string) {
    this.socket.emit("register", userId);
  }
  sendPrivateMessage(senderId: string, receiverId: string, message: string) {
    this.socket.emit("private-message", { senderId, receiverId, message });
  }

  emitSeen(senderId: string, receiverId: string) {
    this.socket.emit("message-seen", { senderId, receiverId });
  }

  emitTyping(senderId: string, receiverId: string) {
    this.socket.emit("typing", { senderId, receiverId });
  }
  onTyping(callback: (data: any) => void) {
    this.socket.on("typing", callback);
  }

  onSeenStatus(callback: (data: any) => void) {
    this.socket.on("message-seen", callback);
  }

  onPrivateMessage(callback: (data: any) => void) {
    this.socket.on("private-message", callback);
  }

  disconnect() {
    this.socket.disconnect();
  }

}
