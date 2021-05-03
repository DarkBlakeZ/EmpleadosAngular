import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmpleadoService } from 'src/app/Service/empleado.service';

@Component({
  selector: 'app-create-empleados',
  templateUrl: './create-empleados.component.html',
  styleUrls: ['./create-empleados.component.css']
})
export class CreateEmpleadosComponent implements OnInit {

  createEmpleado: FormGroup;
  submitted = false;
  loading = false;
  id: string | null;
  titulo = 'Agregar Empleado';
  
  constructor(private fb: FormBuilder,
              private _empleadoService: EmpleadoService,
              private router: Router,
              private toastr: ToastrService,
              private aRoute: ActivatedRoute
      ) {
    this.createEmpleado = this.fb.group({
      nombre: ['',Validators.required],
      apellido: ['',Validators.required],
      documento: ['',Validators.required],
      salario: ['',Validators.required]
    })
    this.id = this.aRoute.snapshot.paramMap.get('id');
    console.log(this.id)
   }

  ngOnInit(): void {
    this.esEditar()
  }

  agregarEditarEmpleado(){
    this.submitted = true;
    this.loading = true;

    if(this.createEmpleado.invalid){
      return
    }

    if(this.id === null){
      this.agregarEmpleado()
    }else{
      this.editarEmpleado(this.id)
    }
    
  }

  agregarEmpleado(){
    const empleado: any = {
      nombre: this.createEmpleado.value.nombre,
      apellido: this.createEmpleado.value.apellido,
      documento: this.createEmpleado.value.documento,
      salario: this.createEmpleado.value.salario,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    }
    this._empleadoService.agregarEmpleado(empleado).then(()=>{
      this.toastr.success("empleado registrado con exito",'Empleado registrado',{
        positionClass: 'toast-bottom-right'
      });
      this.router.navigate(['/list-empleados'])
    }).catch(e=>{
      console.log(e)
    })
  }

  editarEmpleado(id: string){
    
    const empleado: any = {
      nombre: this.createEmpleado.value.nombre,
      apellido: this.createEmpleado.value.apellido,
      documento: this.createEmpleado.value.documento,
      salario: this.createEmpleado.value.salario,
      fechaActualizacion: new Date()
    }
    this.loading= true;
    this._empleadoService.actualzarEmpleado(id, empleado).then(()=>{
      this.loading = false;
      this.toastr.info('El empleado fue actualizado con exito','Empleado modificado',{
        positionClass:'toast-bottom-right'
      })
      this.router.navigate(['/list-empleados'])
    })
  }

  esEditar(){
    
    if(this.id !== null){
      this.titulo = 'Editar Empleado'
      this.loading = true
      this._empleadoService.getEmpleado(this.id).subscribe(data=>{
        this.loading = false
        this.createEmpleado.setValue({
          documento: data.payload.data()['documento'],
          nombre: data.payload.data()['nombre'],
          apellido: data.payload.data()['apellido'],
          salario: data.payload.data()['salario'],
        })
      })
    }
  }

}
