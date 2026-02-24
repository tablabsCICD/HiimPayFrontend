import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../authservice/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-helpand-support',
  templateUrl: './helpand-support.component.html',
  styleUrl: './helpand-support.component.css'
})
export class HelpandSupportComponent implements OnInit  {

  @Input("config") config: any = {
    type: 1,
    length: 6,
    cssClass: "custom",
    back: {
      stroke: "#2F9688",
      solid: "#f2efd2",
    },
    font: {
      color: "#000000",
      size: "35px",
    },
  };
  // @Input("config") config: any;
  @Output() captchaCode = new EventEmitter();
  showContainer:boolean = false;
  emailForm!: FormGroup;
  captch_input: any;
  code: any = null;
  resultCode: any = null;
  checkCaptchaValue: boolean = false;
  submitted:boolean=false;

  constructor(private toastr:ToastrService,private fb: FormBuilder,private service:ApiService,private router:Router){}

  ngOnInit(): void {
    this.createCaptcha();
    
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      subject: ['',[Validators.required]],
      message: ['', Validators.required]
    });
  }


  onSubmit() {
    if (this.captch_input !== this.resultCode) {
      this.showError();
      this.captch_input = "";
      this.reloadCaptcha();
    } else {
      console.log(this.captch_input, this.resultCode)
      this.showContainer=true;
      // Proceed with form submission
      // ...
    }
  }

  showError() {
    if(this.captch_input?.length>0){
      this.toastr.error('Invalid captcha code');
    }else{
      this.toastr.error('Please enter captcha code');
    }
  }

  // Function to check if captcha input is correct
  checkCaptcha() {
    if (this.captch_input === this.resultCode) {
      //console.log('resultCode',this.resultCode);
      //console.log('same value');
      this.checkCaptchaValue = true;
      return true;
    } else {
      this.checkCaptchaValue = false;
      //console.log('different value');
      return false;
    }
    // return true;
    // Implement captcha validation logic
  }

  // Function to create a new captcha
  createCaptcha() {
    switch (this.config.type) {
      case 1: // only alpha numaric degits to type
        let char =
          Math.random()
            .toString(24)
            .substring(2, this.config.length) +
          Math.random().toString(24).substring(2, 4);
        this.code = this.resultCode = char.toUpperCase();
        break;
      case 2: // solve the calculation
      // let num1 = Math.floor(Math.random() * 99);
      // let num2 = Math.floor(Math.random() * 9);
      // let operators = ['+','-'];
      // let operator = operators[(Math.floor(Math.random() * operators.length))];
      // //this.code =  num1+operator+num2+'=?';
      // //this.resultCode = (operator == '+')? (num1+num2):(num1-num2);
      // break;
    }
    setTimeout(() => {
      let captcahCanvas: any = document.getElementById("captcahCanvas");
      var ctx = captcahCanvas?.getContext("2d");
      ctx.fillStyle = this.config.back.solid;
      ctx.fillRect(0, 0, captcahCanvas.width, captcahCanvas.height);

      ctx.beginPath();

      captcahCanvas.style.letterSpacing = 15 + "px";
      ctx.font = this.config.font.size + " " + this.config.font.family;
      ctx.fillStyle = this.config.font.color;
      ctx.textBaseline = "middle";
      ctx.fillText(this.code, 40, 50);
      if (this.config.back.stroke) {
        ctx.strokeStyle = this.config.back.stroke;
        for (var i = 0; i < 150; i++) {
          ctx.moveTo(Math.random() * 300, Math.random() * 300);
          ctx.lineTo(Math.random() * 300, Math.random() * 300);
        }
        ctx.stroke();
      }

      // this.captchaCode.emit(char);
    }, 100);
    // Generate captcha code and render it on canvas
  }

  reloadCaptcha(): void {
    this.createCaptcha();
  }

  submitForm() {
    if (this.emailForm.valid) {
      const form = this.emailForm.value;
      this.service.helpAndSupport(form.message,form.email,form.subject).subscribe({next:(res)=>{
        if(res.success && res.message==='Email sent successfully!'){
          this.toastr.success('Email sent successfully');
          this.router.navigate(['/auth/userlogin']);
        }
        else{
          this.toastr.error('Error occured while sending mail');
        }
      },error:(err)=>{console.log(err)},complete:()=>{}})
    }
    else{
      this.toastr.error('Please enter valid data');
    }
  }
}
