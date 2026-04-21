import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';

interface Local {
  id: number;
  descripcion: string;
  recomendacion: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  id: number | null = null;
  descripcion: string = '';
  recomendacion: string = '';
  busqueda: string = '';

  locales: Local[] = [];
  localesFiltrados: Local[] = [];
  selectedId: number | null = null;
  editando: boolean = false;
  modalAbierto: boolean = false;

  colores = ['#4A90D9', '#E67E22', '#2ECC71', '#9B59B6', '#E74C3C', '#1ABC9C', '#F39C12', '#3498DB'];

  constructor(private alertCtrl: AlertController) {}

  getColor(id: number): string {
    return this.colores[id % this.colores.length];
  }

  abrirModal() {
    this.editando = false;
    this.id = null;
    this.descripcion = '';
    this.recomendacion = '';
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
    this.id = null;
    this.descripcion = '';
    this.recomendacion = '';
    this.editando = false;
    this.selectedId = null;
  }

  agregar() {
    if (!this.id || !this.descripcion || !this.recomendacion) {
      this.mostrarAlerta('Error', 'Todos los campos son obligatorios.');
      return;
    }

    const existe = this.locales.find(l => l.id === this.id);
    if (existe) {
      this.mostrarAlerta('Error', 'Ya existe un local con ese ID.');
      return;
    }

    this.locales.push({
      id: this.id,
      descripcion: this.descripcion,
      recomendacion: this.recomendacion
    });

    this.localesFiltrados = [...this.locales];
    this.cerrarModal();
  }

  editarRegistro(local: Local) {
    this.id = local.id;
    this.descripcion = local.descripcion;
    this.recomendacion = local.recomendacion;
    this.selectedId = local.id;
    this.editando = true;
    this.modalAbierto = true;
  }

  editar() {
    if (!this.descripcion || !this.recomendacion) {
      this.mostrarAlerta('Error', 'Todos los campos son obligatorios.');
      return;
    }

    const index = this.locales.findIndex(l => l.id === this.selectedId);
    if (index !== -1) {
      this.locales[index].descripcion = this.descripcion;
      this.locales[index].recomendacion = this.recomendacion;
      this.localesFiltrados = [...this.locales];
      this.cerrarModal();
    }
  }

  async confirmarEliminar(local: Local) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: `¿Eliminar "${local.descripcion}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.locales = this.locales.filter(l => l.id !== local.id);
            this.localesFiltrados = [...this.locales];
          }
        }
      ]
    });
    await alert.present();
  }

  buscar() {
    const texto = this.busqueda.toLowerCase();
    this.localesFiltrados = this.locales.filter(l =>
      l.descripcion.toLowerCase().includes(texto) ||
      l.recomendacion.toLowerCase().includes(texto) ||
      l.id.toString().includes(texto)
    );
  }

  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertCtrl.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }
}