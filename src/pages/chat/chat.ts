import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, Events, Platform } from 'ionic-angular';
import { GroupByDaysPipe } from '../../pipes/group-by-days/group-by-days';
import { ApiServicesProvider } from '../../providers/api-services/api-services';
import { UiProvider } from '../../providers/ui/ui';
import { trigger, transition, query, animate, style, keyframes, stagger } from '@angular/animations';
import { Socket } from 'ng-socket-io';

@IonicPage()
@Component({
	selector: 'page-chat',
	templateUrl: 'chat.html',
	animations: [
		trigger('isTypingAnimation', [
			transition(':enter', [
				animate('.2s ease-in', keyframes([
					style({ transform: 'translateY(10px)', opacity: 0, offset: 0 }),
					style({ transform: 'translateY(0)', opacity: 1, offset: 1.0 }),
				]))
			]),
			transition(':leave', [
				animate('.2s ease-out', keyframes([
					style({ transform: 'translateY(0)', opacity: 1, offset: 0 }),
					style({ transform: 'translateY(10px)', opacity: 0, offset: 1.0 }),
				]))
			])
		])
	],
	providers: [GroupByDaysPipe]
})
export class ChatPage {
	public unregisterBackButtonAction: any;
	product_target: any = {};
	discussion_id: any;
	conversation: any = {};
	receiver: any = {};
	createdBy: any = {};
	amCalenderOptions: any = {};
	messages: any = [];
	groupedMessages: any = [];
	newMsg: string;
	typing: boolean = false;
	isTyping: boolean = false;
	onTypingTimeout = null;
	discussionOwner: any = {};
	messagesCurrentPage = 0
	isInfinitScrollEnabled = true
	@ViewChild(Content) content: Content;
	opner: any = null;
	constructor(
		private navParams: NavParams,
		private events: Events,
		private navCtr: NavController,
		public services: ApiServicesProvider,
		private ui: UiProvider,
		private zone: NgZone,
		private platform: Platform,
		private socket: Socket,
		private groupPipe: GroupByDaysPipe,
	) {
		// this.conversation = this.navParams.get("discussion");
		// let from_notif = this.navParams.get("comefromnotif");

		this.conversation = this.navParams.get('conversation') || {};
		this.product_target = this.navParams.get('product');
		this.receiver = this.conversation.receiver;

		// this.socket.connect();
		// if (!this.conversation) {
		// 	if (this.navParams.get('opner')) {
		// 		this.opner = this.navParams.get('opner')
		// 		this.receiver = this.navParams.get('opner');
		// 	} else {
		// 		this.receiver = this.navParams.get('product').person;
		// 	}

		// 	this.product_target = this.navParams.get('product');
		// 	// this.createdBy = this.navParams.get('createdBy') || this.receiver;
		// } else {
		// 	if (!from_notif) {
		// 		this.services.getDiscussionsById(this.conversation.id).then((res: any) => {
		// 			console.log('FROM HERE')
		// 			this.setDiscussion(res)
		// 		})

		// 	} else {
		// 		this.services.getDiscussionsById(this.conversation).then((res: any) => {
		// 			this.setDiscussion(res)
		// 		}).catch(err => {
		// 			this.navCtr.pop();
		// 		});
		// 	}
		// }

		this.amCalenderOptions = {
			sameDay: "Aujourd'hui",
			nextDay: 'Demain',
			lastDay: 'Hier',
			nextWeek: 'dddd',
			lastWeek: 'dddd',
			sameElse: 'DD/MM/YYYY'
		}


		// this.socket.on('newMessage', (msg) => {
		// 	if (msg.createdBy !== services.current_user.id) {
		// 		this.zone.run(() => {
		// 			this.isTyping = false;
		// 			this.messages.push(msg);
		// 			this.groupedMessages = new GroupByDaysPipe().transform(this.messages, 'created_at');
		// 			this.scrollToBottom();
		// 		})
		// 	}
		// });

		// this.socket.on('isTyping', (userId) => {
		// 	if (services.current_user.id != userId) {
		// 		this.zone.run(() => {
		// 			this.isTyping = true;
		// 			this.scrollToBottom();
		// 		})
		// 	}
		// });

		// this.socket.on('notTyping', (userId) => {
		// 	if (services.current_user.id != userId) {
		// 		this.isTyping = false;
		// 		this.typing = false;
		// 	}
		// });

		this.initApp()
	}

	ionViewWillLeave() {
		this.unregisterBackButtonAction && this.unregisterBackButtonAction();
		this.events.publish('chatPage', null)
	}

	ionViewDidEnter() {
		this.initializeBackButtonCustomHandler();
	}

	async initApp() {
		await this.initChat();
		this.initSocket()
	}

	initSocket() {
		this.socket.connect();

		this.socket.emit('joint-room', this.conversation.id);

		this.socket.on('newMessage', (msg) => {
			if (msg.sender.id !== this.services.current_user.id) {
				this.zone.run(()=> {
					this.isTyping = false;
					console.log('new Message recieved', msg);
					this.messages.push(msg);
					this.groupedMessages = this.groupPipe.transform(this.messages, 'created_at');
					this.scrollToBottom();
				})
			}
		});

		this.socket.on('isTyping', (userId) => {
			if (this.services.current_user.id !== userId) {
				this.zone.run(()=> {
					this.isTyping = true;
					this.scrollToBottom();
					console.log('isTyping...');
				})
			}
		});

		this.socket.on('notTyping', (userId) => {
			if (this.services.current_user.id !== userId) {
				this.zone.run(()=> {
					this.isTyping = false;
					this.typing = false;
					console.log('stopTyping');
				})
			}
		});
	}

	initChat(infiniteScroll?) {
		return new Promise(async (resolve) => {
			let data = {
				senderId: this.services.current_user.id,
				receiverId: this.receiver.id,
				productId: this.conversation.product.id
			}
			this.messagesCurrentPage++;
			this.conversation = await this.services.initConversation(data, this.messagesCurrentPage, infiniteScroll)
			this.events.publish('chatPage', this.conversation.id)
			resolve(true);
			if (this.conversation.messages.length < 10) {
				this.isInfinitScrollEnabled = false;
			}
			this.messages = [...this.conversation.messages.reverse(), ...this.messages]
			this.groupedMessages = this.groupPipe.transform(this.messages, 'created_at');
			if (!infiniteScroll) {
				this.scrollToBottom(0);
			} else {
				infiniteScroll.complete();
			}
		});
	}

	// setDiscussion(res) {
	// 	console.log(res)
	// 	this.conversation = res[0];
	// 	this.discussion_id = this.conversation.id;
	// 	this.createdBy = this.conversation.user.id;
	// 	this.messages = this.conversation.messages || [];
	// 	this.groupedMessages = new GroupByDaysPipe().transform(this.messages, 'created_at');
	// 	this.receiver = this.conversation.user;
	// 	this.product_target = this.conversation.product;
	// 	this.socket.emit('joint-room', this.conversation.id);
	// 	this.scrollToBottom(0);
	// }

	gobackProduct(product?) {
		if (this.navCtr.canGoBack())
			this.navCtr.pop();
		else
			this.navCtr.setRoot('ProductDetailsPage', { product: product })
	}

	// ionViewDidLoad() {
	// 	this.events.publish('isinChat', this.receiver.phone);
	// 	if (this.product_target) {
	// 		if (!this.conversation) {
	// 			this.ui.loading();
	// 			this.services.getCurrentdiscussion(this.product_target.id, this.opner).then((res: any) => {
	// 				this.discussion_id = res.discussion.id;
	// 				this.createdBy = res.discussion.createdBy
	// 				this.messages = res.discussion.messages || [];
	// 				setTimeout(() => {
	// 					this.scrollToBottom();
	// 				}, 500);
	// 				this.conversation = res.discussion;
	// 				this.groupedMessages = new GroupByDaysPipe().transform(this.messages, 'created_at');
	// 				this.socket.emit('joint-room', res.discussion.id);
	// 				this.ui.unLoading();
	// 			}).catch((error: any) => {
	// 				this.services.fireError(error);
	// 				this.ui.unLoading();
	// 			});
	// 		}
	// 	}
	// }

	async pickImage() {
		const image = await this.ui.imageType();
		this.sendMsg(image)
	}

	onFocus() {
		this.zone.run(() => {
			this.content.resize();
			this.scrollToBottom();
		});
	}

	onTyping() {
		if (this.typing == false) {
			this.typing = true;
			this.socket.emit('typing', { 'userId': this.services.current_user.id, 'room': this.conversation.id });
		} else {
			clearTimeout(this.onTypingTimeout);
		}
		this.onTypingTimeout = setTimeout(() => {
			this.typing = false;
			this.socket.emit('noLongerTyping', { 'userId': this.services.current_user.id, 'room': this.conversation.id });
		}, 3000);
	}

	send() {
		if (!this.newMsg.trim()) return;
		this.sendMsg()
	}

	/**
	 * @name sendMsg
	 */
	async sendMsg(image?) {
		let storedMsg: any = {
			conversation_id: this.conversation.id,
			created_at: new Date(),
			sender: this.services.current_user
		}
		if (image) {
			storedMsg.image = image
		} else {
			storedMsg.body = this.newMsg
		}
		this.pushNewMsg(storedMsg);
		if (!image) {
			this.newMsg = null;
		}
		await this.services.storeMessage(storedMsg)
	}

	// sendMsg() {
	// 	console.log(this.product_target)
	// 	if (!this.newMsg.trim()) return;
	// 	// Mock message
	// 	let newMsg = {
	// 		createdBy: this.services.current_user.id,
	// 		user: { name: this.services.current_user.name },
	// 		message: this.newMsg,
	// 		receiver: this.receiver.name,
	// 		created_at: new Date()
	// 	};
	// 	this.services.sendMesages(this.discussion_id, this.newMsg, this.receiver).then(res => {
	// 		console.log("Send Succesfuly : ", res);
	// 		console.log(this.product_target)
	// 	}).catch(err => {
	// 		this.services.fireError(err);
	// 	});
	// 	// this.chatService.SendNotification(this.newMsg,this.receiver.username,this.receiver.email, this.currentUser).then(res=>{
	// 	// 	console.log("Sending Success");
	// 	// },err=>{
	// 	// 	console.log("Sending Failed");
	// 	// })
	// 	// this.chatService.storeMessage(this.newMsg, this.discussionOwner).then(res=>{
	// 	// console.log("This is the reciver",this.receiver);

	// 	// console.log("DataRecived",res);


	// 	// },err=>{
	// 	// console.log("Error ",err);
	// 	// });

	// 	this.pushNewMsg(newMsg);
	// 	this.newMsg = '';

	// }

	/**
	 * @name pushNewMsg
	 * @param msg
	 */
	pushNewMsg(msg) {
		this.zone.run(()=> {
			this.messages.push(msg);
			this.groupedMessages = this.groupPipe.transform(this.messages, 'created_at');
			this.socket.emit("message", { 'room': this.conversation.id, msg });
			this.scrollToBottom();
		})
	}

	scrollToBottom(duration?: number) {
		setTimeout(() => {
			if (this.content && this.content._scroll) {
				this.content.scrollToBottom(duration);
			}
		}, 200)
	}

	initializeBackButtonCustomHandler(): void {
		this.unregisterBackButtonAction = this.platform.registerBackButtonAction(() => {
			this.whengetout();
		}, 101); // Priority 101 will override back button handling (we set in app.component.ts) as it is bigger then priority 100 configured in app.component.ts file */
	}

	whengetout() {
		this.socket.emit('leave-room', this.conversation.id);
		console.log('leaveRoom', this.conversation.id);
		this.events.publish('leaveChat', this.receiver.phone);
		setTimeout(() => {
			this.socket.disconnect();
			this.navCtr.pop();
			// if (this.navCtr.canGoBack()) {
			// 	this.navCtr.pop();
			// } else {
			// 	this.platform.exitApp();
			// }
			console.log('Disconnect');
		}, 100);
	}

}
