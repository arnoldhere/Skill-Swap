import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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

  constructor(private activatedRoute: ActivatedRoute, private toast: ToastService, private socketService: SocketService, private router: Router) { }
  currentUserId: string = '';  // Replace with actual user ID from session
  receiverId: string = '';    // Selected peer's user ID
  message: string = '';
  chatMessages: any[] = [];
  receiverName: string = '';
  markLastMessageSeen: boolean = false;
  typingUser: any = ''



  ngOnInit(): void {

    this.socketService.emitSeen(this.receiverId, this.currentUserId);
    //fetch the users' id
    this.activatedRoute.paramMap.subscribe(params => {
      this.receiverId = params.get('senderId') || "";
      this.currentUserId = params.get('receiverId') || "";
      this.receiverName = params.get('name') || "";
    });

    this.socketService.onSeenStatus((data) => {
      // You can update UI to show ✅
      this.markLastMessageSeen = true;
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
  closeChat() {
    this.toast.info("Please wait.....Chat closed");
    this.socketService.disconnect();
    setTimeout(() => {
      this.router.navigate(["/user/explore"])
    }, 1500);
  }

}
