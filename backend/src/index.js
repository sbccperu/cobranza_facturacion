process.env.TZ = "America/Lima";
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const db = require('./config/db');
const clienteRoutes = require('./routes/clienteRoutes');
const rucRoutes = require('./routes/rucRoutes');
const telefonoRoutes = require('./routes/telefonoRotes');
const periodoRoutes = require('./routes/periodoRoutes');
const cobrazaRoutes = require('./routes/cobranzaRouter');
const detalleCobranzaRoutes = require('./routes/detalleCobranzaRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes')
const whatsappRoutes = require('./routes/whatsappRoutes');
const { inicializarWhatsApp } = require('./config/whatsappClient');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/rucs', rucRoutes);
app.use('/api/telefonos', telefonoRoutes);
app.use('/api/periodos', periodoRoutes);
app.use('/api/cobranzas', cobrazaRoutes);
app.use('/api/detallesCobranza', detalleCobranzaRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/whatsapp', whatsappRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log('📱 Iniciando bot de WhatsApp...');
    inicializarWhatsApp();
});