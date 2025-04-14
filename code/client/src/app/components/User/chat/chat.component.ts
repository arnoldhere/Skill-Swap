import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ToastService } from 'angular-toastify';
import { SocketService } from '../../../services/socket.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  imports: [ReactiveFormsModule, FormsModule, RouterModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private toast: ToastService, private socketService: SocketService) { }

  currentUserId: string = '';  // Replace with actual user ID from session
  receiverId: string = '';    // Selected peer's user ID
  message: string = '';
  chatMessages: any[] = [];
  receiverName: string = '';

  ngOnInit(): void {
    this.receiverName = `${localStorage.getItem("firstname")} ${localStorage.getItem("lastname")}`;
    //fetch the users' id
    this.activatedRoute.paramMap.subscribe(params => {
      this.receiverId = params.get('senderId') || "";
      this.currentUserId = params.get('receiverId') || "";
    });

    //socket services
    this.socketService.register(this.currentUserId) // start the socket
    this.socketService.onPrivateMessage((data) => { // prepare the message
      this.chatMessages.push({
        senderId: data.senderId,
        content: data.message,
        time: data.time
      });
    });
  }
  sendMessage() {
    if (this.message.trim()) {
      this.socketService.sendPrivateMessage(
        this.currentUserId,
        this.receiverId,
        this.message
      );

      this.chatMessages.push({
        senderId: this.currentUserId,
        text: this.message,
        time: new Date()
      });

      this.message = '';
    }
  }
}
