import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IdeaService } from 'src/app/services/idea.service';
import { ToastController } from '@ionic/angular';
import { CustomerService, Customer } from 'src/app/services/customer.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  customer:Customer = {
    device_id:'',
    email:'',
    mobile:'',
    name:''
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private customerService: CustomerService,
    private toastCtrl: ToastController,
    private router: Router,
    private authService: AuthenticationService
    ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    let id = this.activatedRoute.snapshot.paramMap.get('id');
    if(id){
      this.customerService.getCustomer(id).subscribe(customer => {
        this.customer = customer;
      });

    }
  }

  addCustomer() {
    this.customerService.addCustomer(this.customer).then((docRef) => {
      console.log(`docRef=${docRef.id}`);
      this.authService.login(docRef.id);
      
      this.router.navigateByUrl('/');
      this.showToast('Customer added');
    },
    err => {
      this.showToast('There was an error adding your customer');
    });
  }

  showToast(msg) {
    this.toastCtrl.create({
      message: msg,
      duration: 2000
    }).then(toast => {
      toast.present();
    });
  }

}
