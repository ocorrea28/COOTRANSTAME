import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Ruta, RutaCreateRequest, RutaUpdateRequest } from '../models/ruta.model';
import { RutaService } from '../services/ruta.service';

@Component({
  selector: 'app-ruta-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <!-- Hero Section -->
      <div class="hero">
        <div class="hero-content">
          <div class="hero-icon">🚛</div>
          <h1 class="hero-title">Gestión de Rutas COOTRANSTAME</h1>
          <p class="hero-subtitle">Administre las rutas de transporte de carga y pasajeros</p>
          <div class="stats">
            <div class="stat-card">
              <div class="stat-icon">📊</div>
              <div class="stat-number">{{rutas.length}}</div>
              <div class="stat-label">Total Rutas</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">🚚</div>
              <div class="stat-number">{{getCargaCount()}}</div>
              <div class="stat-label">Rutas Carga</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">🚌</div>
              <div class="stat-number">{{getPasajerosCount()}}</div>
              <div class="stat-label">Rutas Pasajeros</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Information Panel -->
      <div class="section">
        <div class="info-panel">
          <div class="info-header">
            <div class="info-icon">💡</div>
            <h3>Información Importante</h3>
          </div>
          <div class="info-content">
            <div class="info-item">
              <span class="info-bullet">📋</span>
              <strong>Antes de registrar:</strong> Verifique que la ruta no existe previamente en el sistema
            </div>
            <div class="info-item">
              <span class="info-bullet">⚠️</span>
              <strong>Duración recomendada:</strong> Entre 1-24 horas para rutas locales, hasta 48 horas para rutas nacionales
            </div>
            <div class="info-item">
              <span class="info-bullet">🎯</span>
              <strong>Ciudades principales:</strong> Villavicencio, Acacías, Granada, Yopal, Bogotá, Medellín
            </div>
          </div>
        </div>
      </div>

      <!-- Form Section -->
      <div class="section">
        <div class="card">
          <div class="card-header">
            <div class="card-icon">{{editingRuta ? '✏️' : '➕'}}</div>
            <h2 class="card-title">
              {{editingRuta ? 'Editar Ruta' : 'Registrar Nueva Ruta'}}
            </h2>
          </div>
          
          <!-- Form Validation Alert -->
          <div *ngIf="showValidationAlert" class="validation-alert">
            <div class="alert-icon">⚠️</div>
            <div class="alert-content">
              <strong>Revise los siguientes campos:</strong>
              <ul class="alert-list">
                <li *ngIf="isFieldInvalid('origen')">Ciudad de origen es requerida</li>
                <li *ngIf="isFieldInvalid('destino')">Ciudad de destino es requerida</li>
                <li *ngIf="isFieldInvalid('duracion')">Duración debe ser mayor a 0</li>
                <li *ngIf="isFieldInvalid('tipo')">Tipo de servicio es requerido</li>
                <li *ngIf="isDuplicateRoute()">Ya existe una ruta similar registrada</li>
              </ul>
            </div>
          </div>
          
          <form #rutaForm="ngForm" (ngSubmit)="onSubmit(rutaForm)" class="form">
            <div class="form-grid">
              <div class="form-group">
                <label class="label">
                  <span class="label-icon">📍</span>
                  Ciudad de Origen
                  <span class="required">*</span>
                </label>
                <div class="input-container">
                  <input
                    type="text"
                    name="origen"
                    [(ngModel)]="rutaFormData.origen"
                    #origen="ngModel"
                    required
                    minlength="3"
                    maxlength="100"
                    pattern="^[a-zA-ZñÑáéíóúÁÉÍÓÚ\\s]+$"
                    placeholder="Ej: Villavicencio"
                    class="input"
                    [class.error]="isFieldInvalid('origen')"
                    (input)="onFieldChange()"
                  >
                  <div class="input-help" *ngIf="!origen.touched || origen.valid">
                    <span class="help-icon">💡</span>
                    Ingrese solo letras y espacios (mínimo 3 caracteres)
                  </div>
                </div>
                <div *ngIf="isFieldInvalid('origen')" class="error-messages">
                  <span *ngIf="origen.errors?.['required']" class="error-text">
                    <span class="error-icon">❌</span> La ciudad de origen es requerida
                  </span>
                  <span *ngIf="origen.errors?.['minlength']" class="error-text">
                    <span class="error-icon">❌</span> Mínimo 3 caracteres
                  </span>
                  <span *ngIf="origen.errors?.['pattern']" class="error-text">
                    <span class="error-icon">❌</span> Solo se permiten letras y espacios
                  </span>
                </div>
              </div>

              <div class="form-group">
                <label class="label">
                  <span class="label-icon">🎯</span>
                  Ciudad de Destino
                  <span class="required">*</span>
                </label>
                <div class="input-container">
                  <input
                    type="text"
                    name="destino"
                    [(ngModel)]="rutaFormData.destino"
                    #destino="ngModel"
                    required
                    minlength="3"
                    maxlength="100"
                    pattern="^[a-zA-ZñÑáéíóúÁÉÍÓÚ\\s]+$"
                    placeholder="Ej: Bogotá"
                    class="input"
                    [class.error]="isFieldInvalid('destino')"
                    (input)="onFieldChange()"
                  >
                  <div class="input-help" *ngIf="!destino.touched || destino.valid">
                    <span class="help-icon">💡</span>
                    Debe ser diferente a la ciudad de origen
                  </div>
                </div>
                <div *ngIf="isFieldInvalid('destino')" class="error-messages">
                  <span *ngIf="destino.errors?.['required']" class="error-text">
                    <span class="error-icon">❌</span> La ciudad de destino es requerida
                  </span>
                  <span *ngIf="destino.errors?.['minlength']" class="error-text">
                    <span class="error-icon">❌</span> Mínimo 3 caracteres
                  </span>
                  <span *ngIf="destino.errors?.['pattern']" class="error-text">
                    <span class="error-icon">❌</span> Solo se permiten letras y espacios
                  </span>
                </div>
                <div *ngIf="isSameCity()" class="warning-text">
                  <span class="warning-icon">⚠️</span> La ciudad de destino debe ser diferente al origen
                </div>
              </div>

              <div class="form-group">
                <label class="label">
                  <span class="label-icon">⏱️</span>
                  Duración (horas)
                  <span class="required">*</span>
                </label>
                <div class="input-container">
                  <input
                    type="number"
                    name="duracion"
                    [(ngModel)]="rutaFormData.duracion"
                    #duracion="ngModel"
                    required
                    min="0.5"
                    max="48"
                    step="0.5"
                    placeholder="Ej: 6.5"
                    class="input"
                    [class.error]="isFieldInvalid('duracion')"
                    [class.warning]="isLongDuration()"
                    (input)="onFieldChange()"
                  >
                  <div class="input-help" *ngIf="!duracion.touched || duracion.valid">
                    <span class="help-icon">💡</span>
                    Tiempo estimado de viaje (puede incluir decimales)
                  </div>
                </div>
                <div *ngIf="isFieldInvalid('duracion')" class="error-messages">
                  <span *ngIf="duracion.errors?.['required']" class="error-text">
                    <span class="error-icon">❌</span> La duración es requerida
                  </span>
                  <span *ngIf="duracion.errors?.['min']" class="error-text">
                    <span class="error-icon">❌</span> Duración mínima: 0.5 horas (30 minutos)
                  </span>
                  <span *ngIf="duracion.errors?.['max']" class="error-text">
                    <span class="error-icon">❌</span> Duración máxima: 48 horas
                  </span>
                </div>
                <div *ngIf="isLongDuration() && duracion.valid" class="warning-text">
                  <span class="warning-icon">⚠️</span> Ruta de larga duración (más de 12 horas) - Verifique que sea correcta
                </div>
              </div>

              <div class="form-group">
                <label class="label">
                  <span class="label-icon">🚛</span>
                  Tipo de Servicio
                  <span class="required">*</span>
                </label>
                <div class="input-container">
                  <select
                    name="tipo"
                    [(ngModel)]="rutaFormData.tipo"
                    #tipo="ngModel"
                    required
                    class="input select"
                    [class.error]="isFieldInvalid('tipo')"
                    (change)="onFieldChange()"
                  >
                    <option value="">Seleccionar tipo de servicio</option>
                    <option value="Carga">🚚 Transporte de Carga</option>
                    <option value="Pasajeros">🚌 Transporte de Pasajeros</option>
                  </select>
                  <div class="input-help" *ngIf="!tipo.touched || tipo.valid">
                    <span class="help-icon">💡</span>
                    Seleccione según el tipo de transporte que realizará
                  </div>
                </div>
                <div *ngIf="isFieldInvalid('tipo')" class="error-messages">
                  <span *ngIf="tipo.errors?.['required']" class="error-text">
                    <span class="error-icon">❌</span> Debe seleccionar un tipo de servicio
                  </span>
                </div>
              </div>
            </div>

            <!-- Duplicate Route Warning -->
            <div *ngIf="isDuplicateRoute()" class="duplicate-warning">
              <div class="warning-icon-large">⚠️</div>
              <div class="warning-content">
                <strong>Posible Ruta Duplicada</strong>
                <p>Ya existe una ruta similar: <strong>{{getSimilarRoute()?.origen}} → {{getSimilarRoute()?.destino}}</strong></p>
                <p>¿Está seguro de que desea continuar?</p>
              </div>
            </div>

            <div class="form-actions">
              <button
                type="submit"
                [disabled]="!rutaForm.valid || isSameCity()"
                class="btn btn-primary"
                [class.loading]="isSubmitting"
              >
                <span class="btn-icon" *ngIf="!isSubmitting">{{editingRuta ? '💾' : '✅'}}</span>
                <span class="btn-icon loading-spinner" *ngIf="isSubmitting">⏳</span>
                {{isSubmitting ? 'Procesando...' : (editingRuta ? 'Actualizar Ruta' : 'Registrar Ruta')}}
              </button>
              <button
                *ngIf="editingRuta"
                type="button"
                (click)="cancelEdit()"
                class="btn btn-secondary"
                [disabled]="isSubmitting"
              >
                <span class="btn-icon">❌</span>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- List Section -->
      <div class="section">
        <div class="card">
          <div class="card-header">
            <div class="card-icon">📋</div>
            <h2 class="card-title">Rutas Registradas</h2>
            <select [(ngModel)]="filtroTipo" (ngModelChange)="filtrarRutas()" class="filter">
              <option value="">🔍 Todas las rutas</option>
              <option value="Carga">🚚 Solo Carga</option>
              <option value="Pasajeros">🚌 Solo Pasajeros</option>
            </select>
          </div>

          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Origen</th>
                  <th>Destino</th>
                  <th>Duración</th>
                  <th>Tipo</th>
                  <th>Fecha Registro</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let ruta of rutasFiltradas" class="table-row">
                  <td class="td-id">#{{ruta.id}}</td>
                  <td class="td-city">📍 {{ruta.origen}}</td>
                  <td class="td-city">🎯 {{ruta.destino}}</td>
                  <td class="td-duration">{{ruta.duracion}} hrs</td>
                  <td>
                    <span class="badge" [class]="'badge-' + ruta.tipo.toLowerCase()">
                      {{ruta.tipo === 'Carga' ? '🚚' : '🚌'}} {{ruta.tipo}}
                    </span>
                  </td>
                  <td class="td-date">{{ruta.fechaCreacion | date:'dd/MM/yyyy HH:mm'}}</td>
                  <td class="td-actions">
                    <button (click)="editRuta(ruta)" class="btn-action btn-edit" title="Editar">
                      ✏️
                    </button>
                    <button (click)="deleteRuta(ruta.id)" class="btn-action btn-delete" title="Eliminar">
                      🗑️
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            
            <div *ngIf="rutasFiltradas.length === 0" class="empty">
              <div class="empty-icon">🚛</div>
              <p class="empty-title">{{filtroTipo ? 'No hay rutas de este tipo' : 'No hay rutas registradas'}}</p>
              <p class="empty-desc">{{filtroTipo ? 'Pruebe con otro filtro o registre una nueva ruta' : 'Comience registrando su primera ruta de transporte'}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      min-height: calc(100vh - 160px);
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    }

    .hero {
      background: linear-gradient(135deg, #1e40af 0%, #1d4ed8 50%, #2563eb 100%);
      padding: 60px 0;
      position: relative;
      overflow: hidden;
    }

    .hero::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fbbf24' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
      opacity: 0.2;
    }

    .hero-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
      text-align: center;
      position: relative;
      z-index: 2;
    }

    .hero-icon {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #fbbf24, #f59e0b);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 36px;
      margin: 0 auto 24px;
      box-shadow: 0 12px 40px rgba(251, 191, 36, 0.4);
      border: 3px solid rgba(255, 255, 255, 0.2);
    }

    .hero-title {
      color: white;
      font-size: 2.75rem;
      font-weight: 800;
      margin: 0 0 16px 0;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      line-height: 1.2;
    }

    .hero-subtitle {
      color: rgba(251, 191, 36, 0.9);
      font-size: 1.25rem;
      font-weight: 500;
      margin: 0 0 48px 0;
      line-height: 1.4;
    }

    .stats {
      display: flex;
      justify-content: center;
      gap: 32px;
      flex-wrap: wrap;
    }

    .stat-card {
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      padding: 32px 24px;
      text-align: center;
      min-width: 140px;
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 16px 40px rgba(251, 191, 36, 0.3);
      background: rgba(251, 191, 36, 0.2);
    }

    .stat-icon {
      font-size: 2rem;
      margin-bottom: 12px;
    }

    .stat-number {
      color: white;
      font-size: 2.5rem;
      font-weight: 900;
      margin-bottom: 8px;
      display: block;
    }

    .stat-label {
      color: rgba(251, 191, 36, 0.9);
      font-size: 0.875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .section {
      max-width: 1200px;
      margin: 0 auto;
      padding: 32px 24px;
    }

    .info-panel {
      background: linear-gradient(135deg, #eff6ff, #dbeafe);
      border: 1px solid #bfdbfe;
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 32px;
      border-left: 4px solid #1e40af;
    }

    .info-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .info-icon {
      font-size: 1.5rem;
    }

    .info-header h3 {
      color: #1e40af;
      font-size: 1.25rem;
      font-weight: 700;
      margin: 0;
    }

    .info-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 16px;
    }

    .info-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      color: #374151;
      font-size: 0.9rem;
      line-height: 1.4;
    }

    .info-bullet {
      font-size: 1.1rem;
      flex-shrink: 0;
    }

    .card {
      background: white;
      border-radius: 20px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(30, 64, 175, 0.1);
      overflow: hidden;
      position: relative;
    }

    .card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #1e40af, #fbbf24);
    }

    .card-header {
      padding: 32px 32px 0;
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
    }

    .card-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #1e40af, #2563eb);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      color: white;
      box-shadow: 0 4px 15px rgba(30, 64, 175, 0.3);
    }

    .card-title {
      color: #1e40af;
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0;
      flex: 1;
    }

    .filter {
      padding: 12px 20px;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      font-size: 0.875rem;
      font-weight: 600;
      background: white;
      color: #374151;
      cursor: pointer;
      transition: all 0.3s ease;
      min-width: 180px;
    }

    .filter:focus {
      outline: none;
      border-color: #1e40af;
      box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
    }

    .validation-alert {
      margin: 24px 32px;
      padding: 16px;
      background: linear-gradient(135deg, #fef2f2, #fee2e2);
      border: 1px solid #fca5a5;
      border-radius: 12px;
      border-left: 4px solid #ef4444;
      display: flex;
      gap: 12px;
    }

    .alert-icon {
      font-size: 1.5rem;
      flex-shrink: 0;
    }

    .alert-content strong {
      color: #dc2626;
      font-weight: 600;
    }

    .alert-list {
      margin: 8px 0 0 0;
      padding: 0 0 0 16px;
      color: #991b1b;
      font-size: 0.9rem;
    }

    .alert-list li {
      margin-bottom: 4px;
    }

    .form {
      padding: 32px;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .label {
      color: #374151;
      font-size: 0.95rem;
      font-weight: 600;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .label-icon {
      font-size: 1.1rem;
    }

    .required {
      color: #ef4444;
      font-weight: 700;
    }

    .input-container {
      position: relative;
    }

    .input {
      width: 100%;
      padding: 14px 16px;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      font-size: 0.95rem;
      transition: all 0.3s ease;
      background: #fafbfc;
    }

    .input:focus {
      outline: none;
      border-color: #1e40af;
      box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
      background: white;
    }

    .input.error {
      border-color: #ef4444;
      background: #fef2f2;
    }

    .input.warning {
      border-color: #f59e0b;
      background: #fffbeb;
    }

    .select {
      cursor: pointer;
    }

    .input-help {
      margin-top: 6px;
      font-size: 0.8rem;
      color: #6b7280;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .help-icon {
      font-size: 0.9rem;
    }

    .error-messages {
      margin-top: 6px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .error-text {
      color: #ef4444;
      font-size: 0.8rem;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .error-icon {
      font-size: 0.9rem;
    }

    .warning-text {
      color: #f59e0b;
      font-size: 0.8rem;
      font-weight: 500;
      margin-top: 6px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .warning-icon {
      font-size: 0.9rem;
    }

    .duplicate-warning {
      margin: 24px 0;
      padding: 20px;
      background: linear-gradient(135deg, #fffbeb, #fef3c7);
      border: 1px solid #fbbf24;
      border-radius: 12px;
      border-left: 4px solid #f59e0b;
      display: flex;
      gap: 16px;
      align-items: flex-start;
    }

    .warning-icon-large {
      font-size: 2rem;
      flex-shrink: 0;
    }

    .warning-content strong {
      color: #92400e;
      font-weight: 700;
      font-size: 1.1rem;
    }

    .warning-content p {
      margin: 8px 0 0 0;
      color: #78350f;
      font-size: 0.9rem;
      line-height: 1.4;
    }

    .form-actions {
      display: flex;
      gap: 16px;
      justify-content: center;
    }

    .btn {
      padding: 14px 28px;
      border: none;
      border-radius: 12px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 160px;
      justify-content: center;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-icon {
      font-size: 1.1rem;
    }

    .loading-spinner {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .btn-primary {
      background: linear-gradient(135deg, #1e40af, #2563eb);
      color: white;
      box-shadow: 0 4px 15px rgba(30, 64, 175, 0.3);
    }

    .btn-primary:hover:not(:disabled) {
      background: linear-gradient(135deg, #1d4ed8, #1e40af);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(30, 64, 175, 0.4);
    }

    .btn-secondary {
      background: linear-gradient(135deg, #6b7280, #4b5563);
      color: white;
      box-shadow: 0 4px 15px rgba(107, 114, 128, 0.3);
    }

    .btn-secondary:hover:not(:disabled) {
      background: linear-gradient(135deg, #4b5563, #374151);
      transform: translateY(-2px);
    }

    .table-container {
      margin: 32px;
      margin-top: 24px;
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
    }

    .table {
      width: 100%;
      border-collapse: collapse;
      background: white;
    }

    .table th {
      background: linear-gradient(135deg, #1e40af, #2563eb);
      color: white;
      padding: 20px 16px;
      text-align: left;
      font-weight: 700;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .table td {
      padding: 16px;
      border-bottom: 1px solid #f1f5f9;
      font-size: 0.9rem;
    }

    .table-row:hover {
      background: linear-gradient(135deg, rgba(30, 64, 175, 0.02), rgba(251, 191, 36, 0.02));
    }

    .table-row:nth-child(even) {
      background: #fafbfc;
    }

    .table-row:nth-child(even):hover {
      background: linear-gradient(135deg, rgba(30, 64, 175, 0.05), rgba(251, 191, 36, 0.05));
    }

    .td-id {
      font-family: ui-monospace, monospace;
      font-weight: 700;
      color: #1e40af;
      font-size: 1rem;
    }

    .td-city {
      font-weight: 600;
      color: #374151;
    }

    .td-duration {
      font-weight: 700;
      color: #f59e0b;
      font-size: 1rem;
    }

    .td-date {
      color: #6b7280;
      font-size: 0.85rem;
    }

    .td-actions {
      text-align: center;
    }

    .badge {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    .badge-carga {
      background: linear-gradient(135deg, #fef3c7, #fde68a);
      color: #92400e;
      border: 1px solid #f59e0b;
    }

    .badge-pasajeros {
      background: linear-gradient(135deg, #dbeafe, #bfdbfe);
      color: #1e40af;
      border: 1px solid #3b82f6;
    }

    .btn-action {
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      margin: 0 4px;
      border-radius: 8px;
      font-size: 1.1rem;
      transition: all 0.3s ease;
    }

    .btn-edit:hover {
      background: #dcfce7;
      transform: scale(1.1);
    }

    .btn-delete:hover {
      background: #fef2f2;
      transform: scale(1.1);
    }

    .empty {
      text-align: center;
      padding: 80px 32px;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 24px;
      opacity: 0.5;
    }

    .empty-title {
      color: #374151;
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0 0 12px 0;
    }

    .empty-desc {
      color: #6b7280;
      font-size: 1rem;
      margin: 0;
    }

    @media (max-width: 768px) {
      .hero {
        padding: 40px 0;
      }

      .hero-title {
        font-size: 2rem;
      }

      .hero-subtitle {
        font-size: 1rem;
      }

      .stats {
        gap: 16px;
      }

      .stat-card {
        padding: 24px 16px;
        min-width: 120px;
      }

      .section {
        padding: 20px 16px;
      }

      .info-content {
        grid-template-columns: 1fr;
      }

      .card-header {
        padding: 24px 20px 0;
        flex-direction: column;
        align-items: stretch;
        gap: 20px;
      }

      .validation-alert {
        margin: 16px 20px;
      }

      .form {
        padding: 24px 20px;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }

      .form-actions {
        flex-direction: column;
      }

      .table-container {
        margin: 20px;
        margin-top: 16px;
      }

      .table th,
      .table td {
        padding: 12px 8px;
        font-size: 0.8rem;
      }

      .empty {
        padding: 60px 20px;
      }
    }
  `]
})
export class RutaListComponent implements OnInit {
  rutas: Ruta[] = [];
  rutasFiltradas: Ruta[] = [];
  rutaFormData: RutaCreateRequest = { origen: '', destino: '', duracion: 0, tipo: '' };
  editingRuta: Ruta | null = null;
  filtroTipo: string = '';
  showValidationAlert: boolean = false;
  isSubmitting: boolean = false;
  rutaForm: any;

  constructor(private rutaService: RutaService) {}

  ngOnInit() {
    this.loadRutas();
  }

  getCargaCount(): number {
    return this.rutas.filter(r => r.tipo === 'Carga').length;
  }

  getPasajerosCount(): number {
    return this.rutas.filter(r => r.tipo === 'Pasajeros').length;
  }

  isSameCity(): boolean {
    return this.rutaFormData.origen.toLowerCase().trim() === 
           this.rutaFormData.destino.toLowerCase().trim() && 
           this.rutaFormData.origen.trim() !== '';
  }

  isLongDuration(): boolean {
    return this.rutaFormData.duracion > 12;
  }

  isDuplicateRoute(): boolean {
    if (!this.rutaFormData.origen || !this.rutaFormData.destino) return false;
    
    return this.rutas.some(ruta => {
      if (this.editingRuta && ruta.id === this.editingRuta.id) return false;
      return ruta.origen.toLowerCase() === this.rutaFormData.origen.toLowerCase() &&
             ruta.destino.toLowerCase() === this.rutaFormData.destino.toLowerCase();
    });
  }

  getSimilarRoute(): Ruta | undefined {
    return this.rutas.find(ruta => {
      if (this.editingRuta && ruta.id === this.editingRuta.id) return false;
      return ruta.origen.toLowerCase() === this.rutaFormData.origen.toLowerCase() &&
             ruta.destino.toLowerCase() === this.rutaFormData.destino.toLowerCase();
    });
  }

  onFieldChange() {
    this.showValidationAlert = false;
    setTimeout(() => {
      if (this.rutaForm && this.rutaForm.invalid && this.hasAnyTouchedField()) {
        this.showValidationAlert = true;
      }
    }, 100);
  }

  isFieldInvalid(fieldName: string): boolean {
    if (!this.rutaForm?.controls) return false;
    const field = this.rutaForm.controls[fieldName];
    return field ? field.invalid && field.touched : false;
  }

  hasValidationErrors(): boolean {
    if (!this.rutaForm?.controls) return false;
    const controls = this.rutaForm.controls;
    return Object.keys(controls).some(key => {
      const control = controls[key];
      return control && control.invalid && control.touched;
    });
  }

  hasAnyTouchedField(): boolean {
    if (!this.rutaForm || !this.rutaForm.controls) return false;
    return Object.keys(this.rutaForm.controls).some(key => 
      this.rutaForm.controls[key].touched
    );
  }

  loadRutas() {
    this.rutaService.getRutas().subscribe({
      next: (rutas) => {
        this.rutas = rutas;
        this.filtrarRutas();
      },
      error: (error) => {
        console.error('Error al cargar rutas:', error);
        alert('❌ Error al cargar las rutas. Por favor, verifique su conexión.');
      }
    });
  }

  filtrarRutas() {
    if (this.filtroTipo) {
      this.rutasFiltradas = this.rutas.filter(r => r.tipo === this.filtroTipo);
    } else {
      this.rutasFiltradas = [...this.rutas];
    }
  }

  onSubmit(form: NgForm) {
    this.rutaForm = form;
    
    if (form.valid && !this.isSameCity()) {
      this.isSubmitting = true;
      if (this.editingRuta) {
        this.updateRuta();
      } else {
        this.createRuta();
      }
    } else {
      this.showValidationAlert = true;
    }
  }

  createRuta() {
    this.rutaService.createRuta(this.rutaFormData).subscribe({
      next: () => {
        this.loadRutas();
        this.resetForm();
        this.isSubmitting = false;
        alert('✅ Ruta registrada exitosamente');
      },
      error: (error) => {
        console.error('Error al crear ruta:', error);
        this.isSubmitting = false;
        alert('❌ Error al registrar la ruta. Verifique los datos e intente nuevamente.');
      }
    });
  }

  editRuta(ruta: Ruta) {
    this.editingRuta = ruta;
    this.rutaFormData = { 
      origen: ruta.origen, 
      destino: ruta.destino, 
      duracion: ruta.duracion, 
      tipo: ruta.tipo 
    };
    this.showValidationAlert = false;
  }

  updateRuta() {
    if (!this.editingRuta) return;

    const updateRequest: RutaUpdateRequest = {
      id: this.editingRuta.id,
      origen: this.rutaFormData.origen,
      destino: this.rutaFormData.destino,
      duracion: this.rutaFormData.duracion,
      tipo: this.rutaFormData.tipo
    };

    this.rutaService.updateRuta(this.editingRuta.id, updateRequest).subscribe({
      next: () => {
        this.loadRutas();
        this.cancelEdit();
        this.isSubmitting = false;
        alert('✅ Ruta actualizada exitosamente');
      },
      error: (error) => {
        console.error('Error al actualizar ruta:', error);
        this.isSubmitting = false;
        alert('❌ Error al actualizar la ruta. Verifique los datos e intente nuevamente.');
      }
    });
  }

  deleteRuta(id: number) {
    if (confirm('🗑️ ¿Está seguro de que desea eliminar esta ruta?\n\nEsta acción no se puede deshacer y eliminará permanentemente la información de la ruta.')) {
      this.rutaService.deleteRuta(id).subscribe({
        next: () => {
          this.loadRutas();
          alert('✅ Ruta eliminada exitosamente');
        },
        error: (error) => {
          console.error('Error al eliminar ruta:', error);
          alert('❌ Error al eliminar la ruta. La ruta podría estar siendo utilizada por otros registros.');
        }
      });
    }
  }

  cancelEdit() {
    this.editingRuta = null;
    this.resetForm();
    this.showValidationAlert = false;
  }

  resetForm() {
    this.rutaFormData = { origen: '', destino: '', duracion: 0, tipo: '' };
    this.showValidationAlert = false;
    this.isSubmitting = false;
  }
} 