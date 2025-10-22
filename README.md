# 🚚 Aplicación de Reparto / Delivery

Aplicación móvil desarrollada con React Native + Expo que permite registrar entregas con fotografía y ubicación geográfica. Los repartidores pueden iniciar sesión, editar su perfil, ver un historial de entregas y registrar nuevas entregas capturando una foto del paquete y su ubicación en el mapa.

## 🚚 Características Principales de la App

- Login con autenticación
- Edición de los datos del Perfil
- Ver los registros de Entregas
- Realizar un nuevo registro de Entrega usando:
- Ubicación y la Camara
- Visualizar en un mapa la ubicación actual
- Visualización y obtención las Coordenadas

## 🚚 Herramientas utilizadas

- Expo
- Firebase
- React native

## 🚚 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/ovelar-C/integradorMovilesExpo.git

# Entrar a la carpeta del proyecto
cd integradorMovilesExpo

# Instalar dependencias
npm install

# Iniciar el proyecto
npm start

- Escanear el QR con Expo Go

## 🚚 Estructura del proyecto

📦 IntegradorDelivery/
├── 📁 assets/                      @   Recursos
└── 📁 navegacion/                  @   Manejo de las pantallas
├── 📁 Pantallas/                   @   Pantallas principales
└── 📁 servicios/                   @   servicios de firebase
├── 📁 validaciones y permisos/     @   validar los datos
|   └── 📄 guardar.js               @   guarda la ubicacion
|   └── 📄 permisos.js              @   solicita los permisos necesarios
|   └── 📄 validar.js               @   validar los datos del usuario
└── 📄 App.js                       @   Entrada principal de la app
├── 📄 firebase.js                  @   Configuracion de Firebase
└── 📄 README.md








