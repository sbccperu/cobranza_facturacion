-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: sistema_cobranzas
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `sistema_cobranzas`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `sistema_cobranzas` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

USE `sistema_cobranzas`;

--
-- Table structure for table `tb001_usuarios`
--

DROP TABLE IF EXISTS `tb001_usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tb001_usuarios` (
  `I001ID_USUARIO` int(11) NOT NULL AUTO_INCREMENT,
  `V001NOMBRE_USUARIO` varchar(50) NOT NULL,
  `V001CORREO` varchar(150) DEFAULT NULL,
  `V001NOMBRE_COMPLETO` varchar(200) DEFAULT NULL,
  `V001PASSWORD` varchar(255) NOT NULL,
  `E001ESTADO_USUARIO` enum('activo','inactivo','eliminado') DEFAULT 'activo',
  PRIMARY KEY (`I001ID_USUARIO`),
  UNIQUE KEY `nombre_usuario` (`V001NOMBRE_USUARIO`),
  UNIQUE KEY `V001CORREO` (`V001CORREO`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb001_usuarios`
--

LOCK TABLES `tb001_usuarios` WRITE;
/*!40000 ALTER TABLE `tb001_usuarios` DISABLE KEYS */;
INSERT INTO `tb001_usuarios` VALUES (1,'admin','jose@gmail.com','JOSE CUTTI','$2b$10$CjUY8erxvfxDSsbDrtByKOkTLgDxGjv0Y0CofCFYbRpLfWO6sx9iS','activo'),(6,'usuario',NULL,NULL,'$2b$10$9KZvRW0AaGHeolaA2inSHO7l28qW35fV2q.IzrwytR6EQgiQE4nMu','activo'),(7,'admin2',NULL,NULL,'$2b$10$pTC.7WajGdMfJz5JnMbafeoOTV8fbfSAKhNLlBk5BmTIfcOQG32.e','activo'),(11,'admin3','admin@empresa.com',NULL,'$2b$10$ALSVO5x0gzup2/.Sa3WsHueQdjaUjbmsqjQOKz6GC0VX4nFeyywfq','activo'),(14,'admin4','admin1@empresa.com','Fray Aaron','$2b$10$Q1BAfcUsOITZprJR8YXtFuUHM4JG6k0X0T3Gj.h6O/yabiz5xc8gW','activo');
/*!40000 ALTER TABLE `tb001_usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb002_clientes`
--

DROP TABLE IF EXISTS `tb002_clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tb002_clientes` (
  `I002ID_CLIENTE` int(11) NOT NULL AUTO_INCREMENT,
  `V002NOMBRE_CLIENTE` varchar(150) NOT NULL,
  `F002FECHA_REGISTRO` timestamp NOT NULL DEFAULT current_timestamp(),
  `E002ESTADO_CLIENTE` enum('activo','inactivo','eliminado') DEFAULT 'activo',
  PRIMARY KEY (`I002ID_CLIENTE`)
) ENGINE=InnoDB AUTO_INCREMENT=128 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb002_clientes`
--

LOCK TABLES `tb002_clientes` WRITE;
/*!40000 ALTER TABLE `tb002_clientes` DISABLE KEYS */;
INSERT INTO `tb002_clientes` VALUES (4,'INVERCIONES ALJAM S.A.C','2026-03-09 18:26:23','activo'),(5,'GRUPO JR PACCO S.A.C','2026-03-09 18:26:23','activo'),(6,'pepe tiburon','2026-03-09 18:26:23','activo'),(7,'CORPORACION VC S.A.C','2026-03-09 18:26:23','activo'),(8,'ARIZONA COMPANY E.I.R.L','2026-03-09 18:26:24','activo'),(9,'ARATA SANCHEZ ANA MARIA','2026-03-09 18:26:24','activo'),(10,'PEREZ CALLA├æAUPA JORGE ARMANDO','2026-03-09 18:26:24','activo'),(11,'EL LE├æADOR JV E.I.R.L','2026-03-09 18:26:24','activo'),(12,'EL LE├æADOR LA VICTORIA','2026-03-09 18:26:24','activo'),(13,'INDUSTRIA PRODUCTORA DE ALIMENTOS SIBERIA','2026-03-09 18:26:24','activo'),(14,'CORPORACION TRATTORIA V & L E.I.R.L.(pizzeriamancosegundo)','2026-03-09 18:26:24','activo'),(15,'SERVICIOS IMPORTACIONES Y EXPORTACIONES AMARO','2026-03-09 18:26:24','activo'),(16,'& V CHIKEN NEGOCIOS S.A.C.','2026-03-09 18:26:24','activo'),(17,'REYES HUARCA PEDRO JAVIER','2026-03-09 18:26:24','activo'),(18,'PARINANGO DURAN YONATAN','2026-03-09 18:26:24','activo'),(19,'INVERSIONES ZARELLE E.I.R.L.','2026-03-09 18:26:24','activo'),(20,'Cliente SIN NOMBRE 20614833387','2026-03-09 18:26:24','activo'),(21,'INVERSIONES DON NICOLAS E.I.R.L.','2026-03-09 18:26:24','activo'),(22,'CORPORACION MAVIK E.I.R.L   sede surco','2026-03-09 18:26:24','activo'),(23,'HUERTA PAICO WALTER WILIAM','2026-03-09 18:26:24','activo'),(24,'COLQUE ESCOBEDO KAROL CANDY','2026-03-09 18:26:24','activo'),(25,'RIOS MINAYA MARCOS ABEL','2026-03-09 18:26:24','activo'),(26,'BARRAZA AGUILAR PILAR DEL ROSARIO','2026-03-09 18:26:24','activo'),(27,'marko polleria','2026-03-09 18:26:24','activo'),(28,'CULQUI DIAZ CARLOMAN - nuevo ruc','2026-03-09 18:26:24','activo'),(29,'FLORES ACEVEDO','2026-03-09 18:26:24','activo'),(30,'MARTINEZ CARDENAS GREGORIA LEONOR','2026-03-09 18:26:24','activo'),(31,'EROMANIA E.I.R.L.','2026-03-09 18:26:24','activo'),(32,'AGUILAR DE ROMANI MARINA MAXIMILIANA','2026-03-09 18:26:24','activo'),(33,'CORPORACION TEAM R.A. E.I.R.L.','2026-03-09 18:26:24','activo'),(34,'CORPORACION YAMARO E.I.R.L.','2026-03-09 18:26:24','activo'),(35,'ruc nuevo  cobranza de julio','2026-03-09 18:26:24','activo'),(36,'nuevo ruc bocana (BOCANA SUITES)','2026-03-09 18:26:24','activo'),(37,'NEGOCIOS W & P SOCIEDAD COMERCIAL DE RESPONSABILIDAD LIMITADA','2026-03-09 18:26:24','activo'),(38,'Sin nombre 20614315742 (WM & CO. E.I.R)','2026-03-09 18:26:24','activo'),(39,'INVERSIONES CERVECERAS MR S.A.C.','2026-03-09 18:26:24','activo'),(40,'REDECUY TRADICION Y SABOR S.A.C. 934 144 218  nuevo numero','2026-03-09 18:26:24','activo'),(41,'PIZZEROS ARTESANALES BONAPARTE S.R.L','2026-03-09 18:26:24','activo'),(42,'VICU├æA CALDERON CESAR ANTONIO','2026-03-09 18:26:24','activo'),(43,'polleria el gordito','2026-03-09 18:26:24','activo'),(44,'GROUP INVERSIONES LA MAMASA E.I.R.L.','2026-03-09 18:26:25','inactivo'),(45,'CASTILLO CARBAJAL JORGE LUIS','2026-03-09 18:26:25','activo'),(46,'TINEO MINA RUTH MILAGROS','2026-03-09 18:26:25','activo'),(47,'CORPORACION BRAYAN & LUCERO E.I.R.L.','2026-03-09 18:26:25','activo'),(48,'CHAVEZ BLAS NAVARRO ELLIS','2026-03-09 18:26:25','activo'),(49,'CORPORACION E & G PERU S.A.C.','2026-03-09 18:26:25','activo'),(50,'CADILLO SOTO JUDITH GIOVANNA','2026-03-09 18:26:25','activo'),(51,'RAFAELE BARRIAL JHON MARCELINO','2026-03-09 18:26:25','activo'),(52,'BARRIAL MEJIA ALEJANDRA','2026-03-09 18:26:25','activo'),(53,'INVERSIONES GENERALES & NEGOCIOS CORPORATIVOS HMNOS CENTRAL S.A.C','2026-03-09 18:26:25','activo'),(54,'THE GREAT WINGS FAST FOOD E.I.R.L.','2026-03-09 18:26:25','activo'),(55,'P\'LUIS EMPRESA INDIVIDUAL DE RESPONSABILIDAD LIMITADA','2026-03-09 18:26:25','activo'),(56,'INVERSIONESS RL & JJ S.A.C.','2026-03-09 18:26:25','activo'),(57,'GRUPO CARBONEL S.A.C','2026-03-09 18:26:25','activo'),(58,'CADILLO SOTO VILCA CHIC CHIC zapallal y ovalo zapallal','2026-03-09 18:26:25','activo'),(59,'DOMINGUEZ FIGUEROA ZOAILA JESUS','2026-03-09 18:26:25','activo'),(60,'JACKY\'S FRESH MARKET E.I.R.L','2026-03-09 18:26:25','activo'),(61,'WACCES.IMPORT E.I.R.L.','2026-03-09 18:26:25','activo'),(62,'DON PEPE┬┤S POLLOS & PARRILLAS S.R.L.','2026-03-09 18:26:25','activo'),(63,'platinium','2026-03-09 18:26:25','activo'),(64,'RECHARTER 21/05/2025','2026-03-09 18:26:25','activo'),(65,'chic chic nuevo','2026-03-09 18:26:25','activo'),(66,'POLLERIA MEJIA','2026-03-09 18:26:25','activo'),(67,'Cliente SIN NOMBRE 10159965801','2026-03-09 18:26:25','activo'),(68,'encuentro de los andes','2026-03-09 18:26:25','activo'),(69,'haki','2026-03-09 18:26:25','inactivo'),(70,'Raul Ocon SABORES CUSQUE├æOS','2026-03-09 18:26:25','activo'),(71,'gladis SABOR A FUEGO','2026-03-09 18:26:25','activo'),(72,'xiomara roxishop','2026-03-09 18:26:25','activo'),(73,'EL LE├æADOR PANGOA SOCIEDAD ANONIMA','2026-03-09 18:26:25','activo'),(74,'kevin cordoba','2026-03-09 18:26:25','activo'),(75,'19 diciembre PATATAS PERU','2026-03-09 18:26:25','activo'),(76,'ENYEL SOCIEDAD ANONIMA CERRADA(programador market) gerente susana encargada','2026-03-09 18:26:25','activo'),(77,'nuevo ruc arcas','2026-03-09 18:26:26','activo'),(78,'hamburgueceria alfredo','2026-03-09 18:26:26','activo'),(79,'cabrera rubio claudia recomendado por ajies','2026-03-09 18:26:26','activo'),(80,'facturador juliaca','2026-03-09 18:26:26','activo'),(81,'LOZANO RIVERO FIDEL EDGAR','2026-03-09 18:26:26','activo'),(82,'RECREO CAMPESTRE DON LADI S.A.C.','2026-03-09 18:26:26','activo'),(121,'CORPORACI├ôN LE├æADOR JV S.A.C.','2026-03-20 19:16:08','activo'),(124,'SAZON CRIOLLO FOOD E.I.R.L.','2026-04-18 19:48:37','activo'),(125,'haki nuevo','2026-05-19 19:46:02','activo'),(126,'haki carabayllo','2026-05-19 19:46:02','activo'),(127,'comic','2026-05-19 19:46:02','activo');
/*!40000 ALTER TABLE `tb002_clientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb003_periodos`
--

DROP TABLE IF EXISTS `tb003_periodos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tb003_periodos` (
  `I003ID_PERIODOS` int(11) NOT NULL AUTO_INCREMENT,
  `D003FECHA_INICIO` date NOT NULL,
  `D003FECHA_FIN` date NOT NULL,
  `V003DESCRIPCION` varchar(100) NOT NULL,
  `E003ESTADO_PERIODO` enum('activo','inactivo','eliminado') DEFAULT 'activo',
  PRIMARY KEY (`I003ID_PERIODOS`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb003_periodos`
--

LOCK TABLES `tb003_periodos` WRITE;
/*!40000 ALTER TABLE `tb003_periodos` DISABLE KEYS */;
INSERT INTO `tb003_periodos` VALUES (1,'2026-03-01','2026-03-31','Marzo 2026','activo'),(7,'2026-04-01','2026-04-30','Abril 2026','activo'),(8,'2026-05-01','2026-05-31','Mayo 2026','activo');
/*!40000 ALTER TABLE `tb003_periodos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb004_telefonos`
--

DROP TABLE IF EXISTS `tb004_telefonos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tb004_telefonos` (
  `I004ID_TELEFONO` int(11) NOT NULL AUTO_INCREMENT,
  `I002ID_CLIENTE` int(11) NOT NULL,
  `V004NUMERO` varchar(20) NOT NULL,
  `E004ESTADO_TELEFONO` enum('activo','inactivo','eliminado') DEFAULT 'activo',
  PRIMARY KEY (`I004ID_TELEFONO`),
  KEY `fk_tb004_cliente` (`I002ID_CLIENTE`),
  CONSTRAINT `fk_tb004_cliente` FOREIGN KEY (`I002ID_CLIENTE`) REFERENCES `tb002_clientes` (`I002ID_CLIENTE`)
) ENGINE=InnoDB AUTO_INCREMENT=190 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb004_telefonos`
--

LOCK TABLES `tb004_telefonos` WRITE;
/*!40000 ALTER TABLE `tb004_telefonos` DISABLE KEYS */;
INSERT INTO `tb004_telefonos` VALUES (5,4,'982 988 646','activo'),(6,5,'931352788','activo'),(7,6,'931352788','activo'),(8,7,'974 436 748','eliminado'),(9,8,'953 317 714','activo'),(10,9,'953 317 714','activo'),(11,10,'936 174 184','activo'),(12,11,'959 585 074','activo'),(13,12,'950 826 356','activo'),(14,13,'976 533 915','activo'),(15,14,'983 346 990','activo'),(16,15,'991 698 510','activo'),(17,16,'952 376 002','activo'),(18,17,'952 376 002','activo'),(19,18,'982 445 870','activo'),(20,19,'951 865 930','activo'),(21,20,'951 865 930','activo'),(22,21,'951 865 930','activo'),(23,22,'976 503 940','activo'),(24,23,'963 539 029','activo'),(25,24,'958 060 987','activo'),(26,25,'958 060 987','activo'),(27,26,'964 226 038','activo'),(28,27,'964 226 038','activo'),(29,28,'950103029','activo'),(30,29,'955 018 264','activo'),(31,30,'955 018 264','activo'),(32,31,'935 571 601','activo'),(33,32,'935 571 601','activo'),(34,33,'935 571 601','activo'),(35,34,'935 571 601','activo'),(36,35,'935 571 601','activo'),(38,37,'965 835 006','activo'),(41,41,'978 728 142','activo'),(42,42,'936 800 038','activo'),(43,43,'936 800 038','activo'),(44,44,'924 599 135','activo'),(45,45,'993 112 705','activo'),(46,46,'927 112 774','activo'),(47,47,'922 928 461','activo'),(48,48,'950 951 870','activo'),(49,49,'983 657 886','activo'),(50,50,'948 140 363','activo'),(51,51,'934 991 783','activo'),(52,52,'934 991 783','activo'),(53,53,'977 851 754','activo'),(55,55,'966 305 984','activo'),(56,56,'969 742 362','eliminado'),(57,57,'956 327 786','activo'),(58,58,'940 422 674','activo'),(59,59,'936 325 778','activo'),(60,60,'984 569 218','activo'),(61,61,'955 373 406','activo'),(62,62,'929 205 059','activo'),(63,63,'908 926 792','activo'),(64,64,'908 926 792','activo'),(65,65,'946 608 531 -  946 6','activo'),(66,66,'976 671 170','activo'),(67,67,'976 671 170','activo'),(68,68,'975 125 372','activo'),(69,69,'976 571 212','activo'),(70,70,'955 290 294','activo'),(71,71,'986 486 361','activo'),(72,72,'987 789 868','activo'),(73,73,'938 730 769','activo'),(74,74,'984 331 886','activo'),(75,75,'967 266 067','activo'),(76,76,'947 304 755','activo'),(77,77,'959 659 747','activo'),(78,78,'972811078','activo'),(79,79,'992 167 132','activo'),(81,81,'934 960 642','activo'),(102,38,'965 835 006','activo'),(103,40,'934 144 218','activo'),(107,36,'965 835 006','activo'),(109,80,'943 717 182','activo'),(127,82,'921931060','eliminado'),(176,121,'959 585 074','activo'),(178,54,'1 973 836 3876','activo'),(181,39,'932338127','activo'),(182,124,'963181750','activo'),(183,56,'969742362','eliminado'),(184,56,'930909005','activo'),(185,82,'975 125 372','activo'),(186,125,'976571212','activo'),(187,126,'976571212','activo'),(188,127,'996817188','activo'),(189,7,'926609758','activo');
/*!40000 ALTER TABLE `tb004_telefonos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb005_rucs`
--

DROP TABLE IF EXISTS `tb005_rucs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tb005_rucs` (
  `I005ID_RUC` int(11) NOT NULL AUTO_INCREMENT,
  `I002ID_CLIENTE` int(11) NOT NULL,
  `V005NUMERO_RUC` varchar(20) NOT NULL,
  `V005RAZON_SOCIAL` varchar(200) NOT NULL,
  `E005ESTADO_RUC` enum('activo','inactivo','eliminado') DEFAULT 'activo',
  PRIMARY KEY (`I005ID_RUC`),
  KEY `fk_tb005_cliente` (`I002ID_CLIENTE`),
  CONSTRAINT `fk_tb005_cliente` FOREIGN KEY (`I002ID_CLIENTE`) REFERENCES `tb002_clientes` (`I002ID_CLIENTE`)
) ENGINE=InnoDB AUTO_INCREMENT=179 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb005_rucs`
--

LOCK TABLES `tb005_rucs` WRITE;
/*!40000 ALTER TABLE `tb005_rucs` DISABLE KEYS */;
INSERT INTO `tb005_rucs` VALUES (7,4,'20611382511','INVERCIONES ALJAM S.A.C','activo'),(8,5,'20611052953','GRUPO JR PACCO S.A.C','activo'),(9,6,'20614309726','pepe tiburon','activo'),(10,7,'20609648199','CORPORACION VC S.A.C','activo'),(11,8,'20611110848','ARIZONA COMPANY E.I.R.L','activo'),(12,9,'10154207487','ARATA SANCHEZ ANA MARIA','activo'),(13,10,'10456581299','PEREZ CALLA├æAUPA JORGE ARMANDO','activo'),(14,11,'20610523421','EL LE├æADOR JV E.I.R.L','activo'),(15,12,'10479143191','EL LE├æADOR LA VICTORIA','activo'),(16,13,'20481703825','INDUSTRIA PRODUCTORA DE ALIMENTOS SIBERIA','activo'),(17,14,'20612897990','CORPORACION TRATTORIA V & L E.I.R.L.(pizzeriamancosegundo)','activo'),(18,15,'20552706944','SERVICIOS IMPORTACIONES Y EXPORTACIONES AMARO','activo'),(19,16,'20407821174','& V CHIKEN NEGOCIOS S.A.C.','activo'),(20,17,'10040855519','REYES HUARCA PEDRO JAVIER','activo'),(21,18,'10474292385','PARINANGO DURAN YONATAN','activo'),(22,19,'20549036776','INVERSIONES ZARELLE E.I.R.L.','activo'),(23,20,'20614833387','Cliente SIN NOMBRE 20614833387','activo'),(24,21,'20613496301','INVERSIONES DON NICOLAS E.I.R.L.','activo'),(25,22,'20609170850','CORPORACION MAVIK E.I.R.L   sede surco','activo'),(26,23,'10467091421','HUERTA PAICO WALTER WILIAM','activo'),(27,24,'10412495182','COLQUE ESCOBEDO KAROL CANDY','activo'),(28,25,'10431799702','RIOS MINAYA MARCOS ABEL','activo'),(29,26,'10087546565','BARRAZA AGUILAR PILAR DEL ROSARIO','activo'),(30,27,'10464140331','marko polleria','activo'),(31,28,'20613999460','CULQUI DIAZ CARLOMAN - nuevo ruc','activo'),(32,29,'10206628532','FLORES ACEVEDO','activo'),(33,30,'10205643112','MARTINEZ CARDENAS GREGORIA LEONOR','activo'),(34,31,'20609099314','EROMANIA E.I.R.L.','activo'),(35,32,'10285689070','AGUILAR DE ROMANI MARINA MAXIMILIANA','activo'),(36,33,'20608602195','CORPORACION TEAM R.A. E.I.R.L.','activo'),(37,34,'20608560212','CORPORACION YAMARO E.I.R.L.','activo'),(38,35,'20614403820','ruc nuevo  cobranza de julio','activo'),(40,37,'20609191580','NEGOCIOS W & P SOCIEDAD COMERCIAL DE RESPONSABILIDAD LIMITADA','activo'),(42,39,'20605785043','INVERSIONES CERVECERAS MR S.A.C.','activo'),(44,41,'20610894381','PIZZEROS ARTESANALES BONAPARTE S.R.L','activo'),(45,42,'10072548863','VICU├æA CALDERON CESAR ANTONIO','activo'),(46,43,'10321146371','polleria el gordito','activo'),(47,44,'20608509187','GROUP INVERSIONES LA MAMASA E.I.R.L.','activo'),(48,45,'10450548176','CASTILLO CARBAJAL JORGE LUIS','activo'),(49,46,'10482363445','TINEO MINA RUTH MILAGROS','activo'),(50,47,'20606176563','CORPORACION BRAYAN & LUCERO E.I.R.L.','activo'),(51,48,'10459270880','CHAVEZ BLAS NAVARRO ELLIS','activo'),(52,49,'20607507628','CORPORACION E & G PERU S.A.C.','activo'),(53,50,'10475209988','CADILLO SOTO JUDITH GIOVANNA','activo'),(54,51,'10458406087','RAFAELE BARRIAL JHON MARCELINO','activo'),(55,52,'10285897128','BARRIAL MEJIA ALEJANDRA','activo'),(56,53,'20607810983','INVERSIONES GENERALES & NEGOCIOS CORPORATIVOS HMNOS CENTRAL S.A.C','activo'),(58,55,'20606861452','P\'LUIS EMPRESA INDIVIDUAL DE RESPONSABILIDAD LIMITADA','activo'),(59,56,'20600220650','INVERSIONESS RL & JJ S.A.C.','activo'),(60,57,'20606865032','GRUPO CARBONEL S.A.C','activo'),(61,58,'10425964807','CADILLO SOTO VILCA CHIC CHIC zapallal y ovalo zapallal','activo'),(62,59,'10436249832','DOMINGUEZ FIGUEROA ZOAILA JESUS','activo'),(63,60,'20606121939','JACKY\'S FRESH MARKET E.I.R.L','activo'),(64,61,'20605698787','WACCES.IMPORT E.I.R.L.','activo'),(65,62,'20605002600','DON PEPE┬┤S POLLOS & PARRILLAS S.R.L.','activo'),(66,63,'20609904225','platinium','activo'),(67,64,'10455175246','RECHARTER 21/05/2025','activo'),(68,65,'10458784308','chic chic nuevo','activo'),(69,66,'10460750411','POLLERIA MEJIA','activo'),(70,67,'10159965801','Cliente SIN NOMBRE 10159965801','activo'),(71,68,'20612092941','encuentro de los andes','activo'),(72,69,'10904921861','haki','activo'),(73,70,'20612062693','Raul Ocon SABORES CUSQUE├æOS','activo'),(74,71,'10444120253','gladis SABOR A FUEGO','activo'),(75,72,'20612356301','xiomara roxishop','activo'),(76,73,'20612484351','EL LE├æADOR PANGOA SOCIEDAD ANONIMA','activo'),(77,74,'20612587761','kevin cordoba','activo'),(78,75,'20613457501','19 diciembre PATATAS PERU','activo'),(79,76,'20612662143','ENYEL SOCIEDAD ANONIMA CERRADA(programador market) gerente susana encargada','activo'),(80,77,'20607554511','nuevo ruc arcas','activo'),(81,78,'20613180584','hamburgueceria alfredo','activo'),(82,79,'10427497076','cabrera rubio claudia recomendado por ajies','activo'),(84,81,'10067473979','LOZANO RIVERO FIDEL EDGAR','activo'),(105,38,'20614315742','Sin nombre 20614315742 (WM & CO. E.I.R)','activo'),(106,40,'20608780786','REDECUY TRADICION Y SABOR S.A.C. 934 144 218  nuevo numero','activo'),(110,36,'20611868872','nuevo ruc bocana (BOCANA SUITES)','activo'),(112,80,'20614021722','facturador juliaca','activo'),(128,82,'20615016501','RECREO CAMPESTRE DON LADI S.A.C.','activo'),(170,121,'20615052443','CORPORACI├ôN LE├æADOR JV S.A.C.','activo'),(172,54,'20607629316','THE GREAT WINGS FAST FOOD E.I.R.L.','activo'),(175,124,'20612832634','SAZON CRIOLLO FOOD E.I.R.L.','activo'),(176,125,'10456351404','haki nuevo','activo'),(177,126,'20615612384','haki carabayllo','activo'),(178,127,'10100716297','comic','activo');
/*!40000 ALTER TABLE `tb005_rucs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb006_cobranzas`
--

DROP TABLE IF EXISTS `tb006_cobranzas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tb006_cobranzas` (
  `I006ID_COBRANZA` int(11) NOT NULL AUTO_INCREMENT,
  `I002ID_CLIENTE` int(11) NOT NULL,
  `I003ID_PERIODOS` int(11) NOT NULL,
  `I001ID_USUARIO` int(11) NOT NULL,
  `D006MONTO_TOTAL` decimal(10,2) NOT NULL,
  `F006FECHA_PAGO` datetime DEFAULT NULL,
  `V006METODO_PAGO` varchar(50) DEFAULT NULL,
  `E006ESTADO_COBRANZA` enum('activo','inactivo','eliminado') NOT NULL DEFAULT 'activo',
  `I008ID_REPORTE` int(11) DEFAULT NULL,
  `I006PENDIENTE` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`I006ID_COBRANZA`),
  KEY `fk_tb006_cliente` (`I002ID_CLIENTE`),
  KEY `fk_tb006_periodo` (`I003ID_PERIODOS`),
  KEY `fk_tb006_usuario` (`I001ID_USUARIO`),
  KEY `fk_cobranza_reporte` (`I008ID_REPORTE`),
  CONSTRAINT `fk_cobranza_reporte` FOREIGN KEY (`I008ID_REPORTE`) REFERENCES `tb008_lotes_archivados` (`I008ID_REPORTE`),
  CONSTRAINT `fk_tb006_cliente` FOREIGN KEY (`I002ID_CLIENTE`) REFERENCES `tb002_clientes` (`I002ID_CLIENTE`),
  CONSTRAINT `fk_tb006_periodo` FOREIGN KEY (`I003ID_PERIODOS`) REFERENCES `tb003_periodos` (`I003ID_PERIODOS`),
  CONSTRAINT `fk_tb006_usuario` FOREIGN KEY (`I001ID_USUARIO`) REFERENCES `tb001_usuarios` (`I001ID_USUARIO`)
) ENGINE=InnoDB AUTO_INCREMENT=689 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb006_cobranzas`
--

LOCK TABLES `tb006_cobranzas` WRITE;
/*!40000 ALTER TABLE `tb006_cobranzas` DISABLE KEYS */;
INSERT INTO `tb006_cobranzas` VALUES (359,4,1,1,55.00,'2026-04-18 14:38:16','Yape,Plin o trasferencia','inactivo',71,0),(360,5,1,1,63.00,'2026-03-24 10:09:23','BCP (transferencia)','inactivo',70,0),(361,6,1,1,55.00,'2026-03-24 10:09:23','BCP (transferencia)','inactivo',70,0),(362,7,1,1,55.00,'2026-04-18 14:38:16','Yape,Plin o trasferencia','inactivo',71,0),(363,8,1,1,55.00,'2026-03-24 10:13:51','Yape','inactivo',70,0),(364,9,1,1,65.00,'2026-03-24 10:13:51','Yape','inactivo',70,0),(365,10,1,1,55.00,'2026-03-20 16:52:16','Yape','inactivo',70,0),(367,12,1,1,60.00,'2026-03-20 15:57:15','Yape','inactivo',70,0),(368,13,1,1,91.00,'2026-03-20 16:23:00','Yape','inactivo',70,0),(369,14,1,1,76.00,'2026-04-18 14:38:16','Yape,Plin o trasferencia','inactivo',71,0),(370,15,1,1,132.00,'2026-03-24 10:08:13','BCP (transferencia)','inactivo',70,0),(371,16,1,1,55.00,'2026-03-24 10:35:39','Yape','inactivo',70,0),(372,17,1,1,55.00,'2026-03-24 10:35:39','Yape','inactivo',70,0),(373,18,1,1,55.00,'2026-03-20 16:23:17','Yape','inactivo',70,0),(374,19,1,1,94.00,'2026-03-24 10:59:23','Plin','inactivo',70,0),(375,20,1,1,61.00,'2026-03-24 10:59:23','Plin','inactivo',70,0),(376,21,1,1,83.00,'2026-03-24 10:59:23','Plin','inactivo',70,0),(377,22,1,1,73.00,'2026-04-18 14:38:16','Yape,Plin o trasferencia','inactivo',71,0),(378,23,1,1,55.00,'2026-04-18 14:38:16','Yape,Plin o trasferencia','inactivo',71,0),(379,24,1,1,55.00,'2026-03-24 10:12:51','Yape','inactivo',70,0),(380,25,1,1,55.00,'2026-03-24 10:12:51','Yape','inactivo',70,0),(381,26,1,1,55.00,'2026-03-24 10:35:23','Yape','inactivo',70,0),(382,27,1,1,55.00,'2026-03-24 10:35:23','Yape','inactivo',70,0),(383,28,1,1,55.00,'2026-03-24 10:10:58','Yape','inactivo',70,0),(384,29,1,1,55.00,'2026-03-24 10:03:25','Yape','inactivo',70,0),(385,30,1,1,55.00,'2026-03-24 10:03:25','Yape','inactivo',70,0),(386,31,1,1,86.00,'2026-03-20 16:22:39','Yape','inactivo',70,0),(387,32,1,1,59.00,'2026-03-20 16:22:39','Yape','inactivo',70,0),(388,33,1,1,83.00,'2026-03-20 16:22:39','Yape','inactivo',70,0),(389,34,1,1,78.00,'2026-03-20 16:22:39','Yape','inactivo',70,0),(390,35,1,1,57.00,'2026-03-20 16:22:39','Yape','inactivo',70,0),(391,36,1,1,70.00,'2026-03-20 17:34:11','Interbank','inactivo',70,0),(392,37,1,1,117.00,'2026-03-20 17:34:11','Interbank','inactivo',70,0),(393,38,1,1,55.00,'2026-03-20 17:34:11','Interbank','inactivo',70,0),(395,40,1,1,55.00,'2026-03-24 10:45:56','Yape','inactivo',70,0),(396,41,1,1,55.00,'2026-03-24 09:44:55','Yape','inactivo',70,0),(397,42,1,1,68.00,'2026-04-18 14:38:16','Yape,Plin o trasferencia','inactivo',71,0),(398,43,1,1,55.00,'2026-04-18 14:38:16','Yape,Plin o trasferencia','inactivo',71,0),(399,44,1,1,55.00,'2026-04-18 14:38:16','Yape,Plin o trasferencia','inactivo',71,0),(400,45,1,1,55.00,'2026-04-18 14:38:16','Yape,Plin o trasferencia','inactivo',71,0),(401,46,1,1,55.00,'2026-03-24 10:44:53','Yape','inactivo',70,0),(402,47,1,1,55.00,'2026-03-24 10:12:28','Yape','inactivo',70,0),(403,48,1,1,57.00,'2026-03-24 09:41:51','Yape','inactivo',70,0),(404,49,1,1,84.00,'2026-03-20 17:24:35','Yape','inactivo',70,0),(405,50,1,1,82.00,'2026-03-20 15:53:53','Yape','inactivo',70,0),(406,51,1,1,55.00,'2026-03-24 09:44:08','Yape','inactivo',70,0),(407,52,1,1,83.00,'2026-03-24 09:44:08','Yape','inactivo',70,0),(408,53,1,1,61.00,'2026-03-20 18:35:59','Yape','inactivo',70,0),(410,55,1,1,62.42,'2026-03-24 10:09:42','Yape','inactivo',70,0),(411,56,1,1,64.47,'2026-03-24 10:14:06','Yape','inactivo',70,0),(412,57,1,1,60.90,'2026-03-24 09:59:35','Yape','inactivo',70,0),(413,58,1,1,55.00,'2026-04-18 14:38:16','Yape,Plin o trasferencia','inactivo',71,0),(414,59,1,1,56.38,'2026-03-24 10:59:43','Yape','inactivo',70,0),(415,60,1,1,55.00,'2026-03-24 10:10:10','Yape','inactivo',70,0),(416,61,1,1,253.38,'2026-04-18 14:38:16','Yape,Plin o trasferencia','inactivo',71,0),(418,63,1,1,76.65,'2026-04-18 14:38:16','Yape,Plin o trasferencia','inactivo',71,0),(419,64,1,1,55.00,'2026-04-18 14:38:16','Yape,Plin o trasferencia','inactivo',71,0),(420,65,1,1,79.53,'2026-03-20 15:45:37','Yape','inactivo',70,0),(421,66,1,1,69.70,'2026-03-20 18:44:58','Tranferencia BCP','inactivo',70,0),(422,67,1,1,55.00,'2026-03-20 18:44:58','Tranferencia BCP','inactivo',70,0),(423,68,1,1,66.15,'2026-03-24 09:40:35','Yape','inactivo',70,0),(424,69,1,1,55.00,'2026-03-24 17:02:13','Yape','inactivo',70,0),(425,70,1,1,55.00,'2026-03-20 15:19:20','Yape','inactivo',70,0),(426,71,1,1,55.50,'2026-04-18 14:38:16','Yape,Plin o trasferencia','inactivo',71,0),(427,72,1,1,72.03,'2026-03-24 10:41:46','Yape','inactivo',70,0),(428,73,1,1,55.00,'2026-03-20 15:24:47','Yape','inactivo',70,0),(429,74,1,1,55.00,'2026-03-24 10:58:25','Yape','inactivo',70,0),(430,75,1,1,55.00,'2026-03-20 15:07:17','Yape','inactivo',70,0),(431,76,1,1,77.90,'2026-03-24 12:20:55','Yape','inactivo',70,0),(432,77,1,1,55.00,'2026-03-20 17:38:18','Yape','inactivo',70,0),(433,78,1,1,55.00,'2026-04-18 14:38:16','Yape,Plin o trasferencia','inactivo',71,0),(434,79,1,1,55.00,'2026-03-20 15:06:13','Yape','inactivo',70,0),(435,80,1,1,55.00,'2026-04-18 14:38:16','Yape,Plin o trasferencia','inactivo',71,0),(436,81,1,1,57.08,'2026-03-24 11:55:45','Yape','inactivo',70,0),(465,82,1,1,61.25,'2026-03-24 09:43:25','Yape','inactivo',70,0),(514,11,1,1,309.00,'2026-03-20 15:47:30','BCP','inactivo',70,0),(515,121,1,1,55.00,'2026-03-20 15:47:30','BCP','inactivo',70,0),(516,62,1,1,55.00,'2026-03-24 15:18:57','Yape','inactivo',70,0),(520,54,1,1,62.00,'2026-03-24 10:13:33','BCP (transferencia)','inactivo',70,0),(521,39,1,1,55.00,'2026-04-18 14:38:16','Yape,Plin o trasferencia','inactivo',71,0),(524,4,7,1,55.00,'2026-04-21 18:08:26','Yape','inactivo',72,0),(525,5,7,1,65.00,'2026-04-18 16:26:39','Yape','inactivo',72,0),(526,6,7,1,55.00,'2026-04-18 16:26:39','Yape','inactivo',72,0),(527,7,7,1,55.00,'2026-04-23 22:19:40','Yape','inactivo',72,0),(528,8,7,1,55.00,'2026-04-20 16:48:59','Yape','inactivo',72,0),(529,9,7,1,63.00,'2026-04-20 16:48:59','Yape','inactivo',72,0),(530,10,7,1,55.00,'2026-04-19 07:04:27','Yape','inactivo',72,0),(531,11,7,1,343.00,'2026-04-20 17:20:37','INTERBANK EMPRESA','inactivo',72,0),(532,12,7,1,60.00,'2026-04-18 17:12:42','Yape','inactivo',72,0),(533,13,7,1,69.00,'2026-04-19 07:00:06','Yape','inactivo',72,0),(534,14,7,1,79.00,'2026-04-20 22:40:21','BBVA','inactivo',72,0),(535,15,7,1,131.00,'2026-04-19 16:46:44','Yape','inactivo',72,0),(536,16,7,1,55.00,'2026-04-20 17:13:51','Yape','inactivo',72,0),(537,17,7,1,55.00,'2026-04-20 17:13:51','Yape','inactivo',72,0),(538,18,7,1,55.00,'2026-04-18 16:16:00','Yape','inactivo',72,0),(539,19,7,1,97.00,'2026-04-20 16:14:36','Yape','inactivo',72,0),(540,20,7,1,60.00,'2026-04-20 16:14:36','Yape','inactivo',72,0),(541,21,7,1,86.00,'2026-04-20 16:14:36','Yape','inactivo',72,0),(542,22,7,1,75.00,'2026-04-19 07:03:47','Yape','inactivo',72,0),(543,23,7,1,55.00,'2026-04-18 17:42:16','Yape','inactivo',72,0),(544,24,7,1,55.00,'2026-04-20 16:40:46','Yape','inactivo',72,0),(545,25,7,1,55.00,'2026-04-20 16:40:46','Yape','inactivo',72,0),(546,26,7,1,55.00,'2026-04-23 20:26:55','Yape','inactivo',72,0),(547,27,7,1,55.00,'2026-04-23 20:26:55','Yape','inactivo',72,0),(548,28,7,1,55.00,'2026-04-20 16:39:38','Yape','inactivo',72,0),(549,29,7,1,55.00,'2026-04-21 11:36:05','BCP','inactivo',72,0),(550,30,7,1,55.00,'2026-04-21 11:36:05','BCP','inactivo',72,0),(551,31,7,1,94.00,'2026-04-18 17:13:34','Yape','inactivo',72,0),(552,32,7,1,60.00,'2026-04-18 17:13:34','Yape','inactivo',72,0),(553,33,7,1,85.00,'2026-04-18 17:13:34','Yape','inactivo',72,0),(554,34,7,1,84.00,'2026-04-18 17:13:34','Yape','inactivo',72,0),(555,35,7,1,60.00,'2026-04-18 17:13:34','Yape','inactivo',72,0),(556,36,7,1,74.00,'2026-04-18 17:13:55','Yape','inactivo',72,0),(557,37,7,1,115.00,'2026-04-18 17:13:55','Yape','inactivo',72,0),(558,38,7,1,72.00,'2026-04-18 17:13:55','Yape','inactivo',72,0),(559,39,7,1,55.00,'2026-04-22 07:45:26','Yape','inactivo',72,0),(560,40,7,1,55.00,'2026-04-18 15:56:19','Yape','inactivo',72,0),(561,41,7,1,55.00,'2026-05-04 16:46:44','Yape','inactivo',72,0),(562,42,7,1,83.00,'2026-04-18 15:55:29','Yape','inactivo',72,0),(563,43,7,1,55.00,'2026-04-18 15:55:29','Yape','inactivo',72,0),(564,44,7,1,55.00,NULL,NULL,'activo',NULL,1),(565,45,7,1,55.00,'2026-04-23 20:25:02','Yape','inactivo',72,0),(566,46,7,1,55.00,'2026-04-20 17:14:43','Yape','inactivo',72,0),(567,47,7,1,55.00,'2026-04-21 09:05:25','Yape','inactivo',72,0),(568,48,7,1,59.00,'2026-04-20 17:16:03','Yape','inactivo',72,0),(569,49,7,1,86.00,'2026-04-18 16:25:48','Yape','inactivo',72,0),(570,50,7,1,55.00,'2026-04-18 17:13:14','Yape','inactivo',72,0),(571,51,7,1,55.00,'2026-04-20 17:28:03','Yape','inactivo',72,0),(572,52,7,1,87.00,'2026-04-20 17:28:03','Yape','inactivo',72,0),(573,53,7,1,61.00,'2026-04-20 16:41:22','Yape','inactivo',72,0),(574,54,7,1,55.00,'2026-04-19 11:58:55','Yape','inactivo',72,0),(575,55,7,1,55.00,'2026-04-20 16:40:26','Yape','inactivo',72,0),(576,56,7,1,66.00,'2026-04-19 07:05:05','Yape','inactivo',72,0),(577,57,7,1,63.00,'2026-04-19 09:09:35','Yape','inactivo',72,0),(578,58,7,1,55.00,'2026-04-20 18:06:42','BCP','inactivo',72,0),(579,59,7,1,55.00,'2026-04-19 07:02:00','Yape','inactivo',72,0),(580,60,7,1,55.00,'2026-04-20 18:28:50','Yape','inactivo',72,0),(581,61,7,1,304.00,'2026-04-20 17:14:26','BCP','inactivo',72,0),(582,62,7,1,55.00,'2026-04-20 18:37:23','Yape','inactivo',72,0),(583,63,7,1,55.00,'2026-04-23 14:04:32','Yape','inactivo',72,0),(584,64,7,1,55.00,'2026-04-23 14:04:32','Yape','inactivo',72,0),(585,65,7,1,82.00,'2026-04-19 07:02:42','Yape','inactivo',72,0),(586,66,7,1,72.00,'2026-04-20 16:40:07','BCP','inactivo',72,0),(587,67,7,1,55.00,'2026-04-20 16:40:07','BCP','inactivo',72,0),(588,68,7,1,78.00,'2026-04-21 11:08:42','BCP','inactivo',72,0),(589,69,7,1,55.00,'2026-04-18 16:26:14','Yape','inactivo',72,0),(590,70,7,1,55.00,'2026-04-19 11:04:02','Yape','inactivo',72,0),(591,71,7,1,55.00,'2026-04-20 13:59:14','Yape','inactivo',72,0),(592,72,7,1,55.00,'2026-04-20 13:58:38','Yape','inactivo',72,0),(593,73,7,1,55.00,'2026-04-21 09:19:29','Yape','inactivo',72,0),(594,74,7,1,55.00,'2026-04-18 16:07:47','Yape','inactivo',72,0),(595,75,7,1,55.00,'2026-04-19 09:10:34','Yape','inactivo',72,0),(596,76,7,1,80.00,'2026-04-20 13:55:28','Yape','inactivo',72,0),(597,77,7,1,55.00,'2026-04-19 07:00:43','Yape','inactivo',72,0),(598,78,7,1,55.00,'2026-04-20 18:26:51','Yape','inactivo',72,0),(599,79,7,1,55.00,'2026-04-19 07:03:19','Yape','inactivo',72,0),(600,80,7,1,55.00,'2026-04-24 10:02:46','Yape','inactivo',72,0),(601,81,7,1,55.00,'2026-04-22 07:46:33','Yape','inactivo',72,0),(602,82,7,1,55.00,'2026-04-22 13:43:24','BCP','inactivo',72,0),(603,121,7,1,55.00,'2026-04-20 17:20:37','INTERBANK EMPRESA','inactivo',72,0),(604,124,7,1,55.00,'2026-04-19 09:10:05','Yape','inactivo',72,0),(605,69,8,1,55.00,NULL,NULL,'activo',NULL,0),(606,4,8,1,55.00,'2026-05-23 16:34:44','Yape','inactivo',NULL,0),(607,5,8,1,62.00,'2026-05-23 14:52:58','Yape','inactivo',NULL,0),(608,6,8,1,55.00,'2026-05-23 14:52:58','Yape','inactivo',NULL,0),(609,7,8,1,55.00,'2026-05-25 13:22:17','Yape','inactivo',NULL,0),(610,8,8,1,55.00,NULL,NULL,'activo',NULL,1),(611,9,8,1,68.00,NULL,NULL,'activo',NULL,1),(612,10,8,1,55.00,'2026-05-20 14:23:27','Yape','inactivo',NULL,0),(613,11,8,1,338.00,'2026-05-20 14:24:00','Interbank Empresa','inactivo',NULL,0),(614,12,8,1,61.00,'2026-05-23 15:00:03','Yape','inactivo',NULL,0),(615,13,8,1,60.00,'2026-05-19 21:05:44','Yape','inactivo',NULL,0),(616,14,8,1,77.00,'2026-05-25 11:16:10','Yape','inactivo',NULL,0),(617,15,8,1,134.00,'2026-05-23 15:22:42','Yape','inactivo',NULL,0),(618,16,8,1,65.00,'2026-05-23 15:39:14','Yape','inactivo',NULL,0),(619,17,8,1,55.00,'2026-05-23 15:39:14','Yape','inactivo',NULL,0),(620,18,8,1,55.00,'2026-05-19 21:04:43','Yape','inactivo',NULL,0),(621,19,8,1,100.00,'2026-05-21 17:45:13','Yape','inactivo',NULL,0),(622,20,8,1,61.00,'2026-05-21 17:45:13','Yape','inactivo',NULL,0),(623,21,8,1,84.00,'2026-05-21 17:45:13','Yape','inactivo',NULL,0),(624,22,8,1,75.00,'2026-05-21 17:44:43','Yape','inactivo',NULL,0),(625,23,8,1,55.00,'2026-05-19 21:05:30','Yape','inactivo',NULL,0),(626,24,8,1,55.00,'2026-05-20 14:24:44','Yape','inactivo',NULL,0),(627,25,8,1,55.00,'2026-05-20 14:24:44','Yape','inactivo',NULL,0),(628,26,8,1,55.00,'2026-05-23 15:02:36','Yape','inactivo',NULL,0),(629,27,8,1,55.00,'2026-05-23 15:02:36','Yape','inactivo',NULL,0),(630,28,8,1,55.00,'2026-05-23 15:03:46','Yape','inactivo',NULL,0),(631,29,8,1,55.00,'2026-05-23 15:08:31','Yape','inactivo',NULL,0),(632,30,8,1,55.00,'2026-05-23 15:08:31','Yape','inactivo',NULL,0),(633,31,8,1,92.00,'2026-05-19 21:01:42','Yape','inactivo',NULL,0),(634,32,8,1,57.00,'2026-05-19 21:01:42','Yape','inactivo',NULL,0),(635,33,8,1,80.00,'2026-05-19 21:01:42','Yape','inactivo',NULL,0),(636,34,8,1,84.00,'2026-05-19 21:01:42','Yape','inactivo',NULL,0),(637,35,8,1,78.00,'2026-05-19 21:01:42','Yape','inactivo',NULL,0),(638,36,8,1,85.00,'2026-05-19 20:19:36','Yape','inactivo',NULL,0),(639,37,8,1,104.00,'2026-05-19 20:19:36','Yape','inactivo',NULL,0),(640,38,8,1,77.00,'2026-05-19 20:19:36','Yape','inactivo',NULL,0),(641,39,8,1,55.00,'2026-05-19 21:02:35','Yape','inactivo',NULL,0),(642,40,8,1,55.00,NULL,NULL,'activo',NULL,1),(643,41,8,1,55.00,'2026-05-25 12:26:28','Yape','inactivo',NULL,0),(644,42,8,1,83.00,'2026-05-25 17:44:46','Yape','inactivo',NULL,0),(645,43,8,1,55.00,'2026-05-25 17:44:46','Yape','inactivo',NULL,0),(646,44,8,1,55.00,NULL,NULL,'activo',NULL,0),(647,45,8,1,55.00,NULL,NULL,'activo',NULL,1),(648,46,8,1,55.00,'2026-05-23 14:55:29','Yape','inactivo',NULL,0),(649,47,8,1,55.00,'2026-05-19 21:02:21','Yape','inactivo',NULL,0),(650,48,8,1,61.00,'2026-05-23 14:55:49','Yape','inactivo',NULL,0),(651,49,8,1,96.00,'2026-05-23 15:00:22','Yape','inactivo',NULL,0),(652,50,8,1,55.00,'2026-05-20 14:24:20','Yape','inactivo',NULL,0),(653,51,8,1,55.00,'2026-05-21 19:03:45','Yape','inactivo',NULL,0),(654,52,8,1,84.00,'2026-05-21 19:03:45','Yape','inactivo',NULL,0),(655,53,8,1,59.00,'2026-05-19 21:03:29','Yape','inactivo',NULL,0),(656,54,8,1,58.00,'2026-05-23 14:58:06','Yape','inactivo',NULL,0),(657,55,8,1,55.00,'2026-05-21 10:12:32','Yape','inactivo',NULL,0),(658,56,8,1,59.00,'2026-05-19 21:41:52','Yape','inactivo',NULL,0),(659,57,8,1,63.00,'2026-05-23 14:57:46','Yape','inactivo',NULL,0),(660,58,8,1,55.00,'2026-05-23 20:03:27','Yape','inactivo',NULL,0),(661,59,8,1,55.00,'2026-05-23 14:57:30','Yape','inactivo',NULL,0),(662,60,8,1,55.00,'2026-05-21 10:11:55','Yape','inactivo',NULL,0),(663,61,8,1,311.00,'2026-05-23 14:57:14','Yape','inactivo',NULL,0),(664,62,8,1,55.00,'2026-05-23 14:52:34','Yape','inactivo',NULL,0),(665,63,8,1,55.00,'2026-05-20 14:22:53','Yape','inactivo',NULL,0),(666,64,8,1,55.00,'2026-05-20 14:22:53','Yape','inactivo',NULL,0),(667,65,8,1,79.00,'2026-05-19 21:05:16','Yape','inactivo',NULL,0),(668,66,8,1,70.00,'2026-05-20 15:15:44','BCP','inactivo',NULL,0),(669,67,8,1,55.00,'2026-05-20 15:15:44','BCP','inactivo',NULL,0),(670,68,8,1,78.00,'2026-05-23 15:33:32','Yape','inactivo',NULL,0),(671,70,8,1,55.00,'2026-05-25 12:24:40','Yape','inactivo',NULL,0),(672,71,8,1,55.00,'2026-05-25 11:17:26','Yape','inactivo',NULL,0),(673,72,8,1,71.00,'2026-05-21 16:34:23','Yape','inactivo',NULL,0),(674,73,8,1,55.00,'2026-05-19 20:11:14','Yape','inactivo',NULL,0),(675,74,8,1,55.00,'2026-05-23 14:58:43','Yape','inactivo',NULL,0),(676,75,8,1,55.00,'2026-05-20 15:15:12','Yape','inactivo',NULL,0),(677,76,8,1,81.00,'2026-05-23 15:12:36','Yape','inactivo',NULL,0),(678,77,8,1,55.00,'2026-05-23 20:03:44','Yape','inactivo',NULL,0),(679,78,8,1,55.00,'2026-05-23 20:02:11','Yape','inactivo',NULL,0),(680,79,8,1,55.00,'2026-05-19 21:01:57','Yape','inactivo',NULL,0),(681,80,8,1,55.00,NULL,NULL,'activo',NULL,1),(682,81,8,1,55.00,'2026-05-25 18:53:07','Yape','inactivo',NULL,0),(683,82,8,1,55.00,'2026-05-23 15:33:32','Yape','inactivo',NULL,0),(684,121,8,1,55.00,'2026-05-20 14:24:00','Interbank Empresa','inactivo',NULL,0),(685,124,8,1,55.00,'2026-05-25 11:19:18','Yape','inactivo',NULL,0),(686,125,8,1,55.00,'2026-05-23 16:33:16','Yape','inactivo',NULL,0),(687,126,8,1,55.00,'2026-05-23 16:33:16','Yape','inactivo',NULL,0),(688,127,8,1,81.00,'2026-05-20 12:57:06','Yape','inactivo',NULL,0);
/*!40000 ALTER TABLE `tb006_cobranzas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb007_detalle_cobranza`
--

DROP TABLE IF EXISTS `tb007_detalle_cobranza`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tb007_detalle_cobranza` (
  `I007ID_DETALLE` int(11) NOT NULL AUTO_INCREMENT,
  `I006ID_COBRANZA` int(11) NOT NULL,
  `I005ID_RUC` int(11) NOT NULL,
  `I007CANTIDAD_DOCUMENTOS` int(11) NOT NULL,
  `D007MONTO_PAGAR` decimal(10,2) NOT NULL,
  `E007ESTADO_DETALLE` enum('activo','inactivo','eliminado') DEFAULT 'activo',
  PRIMARY KEY (`I007ID_DETALLE`),
  KEY `fk_tb007_cobranza` (`I006ID_COBRANZA`),
  KEY `fk_tb007_ruc` (`I005ID_RUC`),
  CONSTRAINT `fk_tb007_cobranza` FOREIGN KEY (`I006ID_COBRANZA`) REFERENCES `tb006_cobranzas` (`I006ID_COBRANZA`),
  CONSTRAINT `fk_tb007_ruc` FOREIGN KEY (`I005ID_RUC`) REFERENCES `tb005_rucs` (`I005ID_RUC`)
) ENGINE=InnoDB AUTO_INCREMENT=443 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb007_detalle_cobranza`
--

LOCK TABLES `tb007_detalle_cobranza` WRITE;
/*!40000 ALTER TABLE `tb007_detalle_cobranza` DISABLE KEYS */;
INSERT INTO `tb007_detalle_cobranza` VALUES (157,465,128,750,61.25,'activo'),(158,436,84,583,57.08,'activo'),(159,435,112,499,55.00,'activo'),(160,434,82,499,55.00,'activo'),(161,433,81,499,55.00,'activo'),(162,432,80,499,55.00,'activo'),(163,431,79,1416,77.90,'activo'),(164,430,78,499,55.00,'activo'),(165,429,77,499,55.00,'activo'),(166,428,76,499,55.00,'activo'),(167,427,75,1181,72.03,'activo'),(168,426,74,520,55.50,'activo'),(169,425,73,499,55.00,'activo'),(170,424,72,499,55.00,'activo'),(171,423,71,946,66.15,'activo'),(172,422,70,499,55.00,'activo'),(177,421,69,1088,69.70,'activo'),(178,420,68,1481,79.53,'activo'),(179,419,67,499,55.00,'activo'),(180,418,66,1366,76.65,'activo'),(182,416,64,8435,253.38,'activo'),(183,415,63,499,55.00,'activo'),(184,414,62,555,56.38,'activo'),(185,413,61,499,55.00,'activo'),(186,412,60,736,60.90,'activo'),(187,411,59,879,64.47,'activo'),(188,410,58,797,62.42,'activo'),(192,408,56,738,61.00,'activo'),(193,407,55,1607,83.00,'activo'),(194,406,54,499,55.00,'activo'),(195,405,53,1568,82.00,'activo'),(196,404,52,1645,84.00,'activo'),(197,403,51,585,57.00,'activo'),(198,401,49,499,55.00,'activo'),(199,402,50,499,55.00,'activo'),(200,400,48,499,55.00,'activo'),(201,399,47,499,55.00,'activo'),(202,398,46,499,55.00,'activo'),(203,397,45,1012,68.00,'activo'),(204,396,44,499,55.00,'activo'),(205,395,106,499,55.00,'activo'),(207,393,105,499,55.00,'activo'),(208,392,40,2986,117.00,'activo'),(209,391,110,1098,70.00,'activo'),(210,390,38,563,57.00,'activo'),(211,389,37,1421,78.00,'activo'),(212,388,36,1634,83.00,'activo'),(213,387,35,677,59.00,'activo'),(214,386,34,1757,86.00,'activo'),(215,385,33,499,55.00,'activo'),(216,384,32,499,55.00,'activo'),(217,383,31,499,55.00,'activo'),(218,382,30,499,55.00,'activo'),(219,381,29,499,55.00,'activo'),(220,380,28,499,55.00,'activo'),(221,379,27,499,55.00,'activo'),(222,378,26,499,55.00,'activo'),(223,377,25,1204,73.00,'activo'),(224,376,24,1608,83.00,'activo'),(225,375,23,755,61.00,'activo'),(226,374,22,2069,94.00,'activo'),(227,373,21,499,55.00,'activo'),(228,372,20,499,55.00,'activo'),(229,371,19,499,55.00,'activo'),(230,370,18,3583,132.00,'activo'),(231,369,17,1327,76.00,'activo'),(232,368,16,1959,91.00,'activo'),(233,367,15,707,60.00,'activo'),(235,365,13,499,55.00,'activo'),(236,364,12,909,65.00,'activo'),(237,363,11,499,55.00,'activo'),(238,362,10,499,55.00,'activo'),(239,361,9,499,55.00,'activo'),(240,360,8,826,63.00,'activo'),(241,359,7,499,55.00,'activo'),(272,514,14,10655,309.00,'activo'),(273,515,170,7,55.00,'activo'),(274,516,65,499,55.00,'activo'),(277,520,172,797,62.00,'activo'),(278,521,42,499,55.00,'activo'),(280,604,175,500,55.00,'activo'),(281,603,170,500,55.00,'activo'),(282,531,14,12029,343.00,'activo'),(283,602,128,500,55.00,'activo'),(284,601,84,500,55.00,'activo'),(285,600,112,500,55.00,'activo'),(286,599,82,500,55.00,'activo'),(287,598,81,499,55.00,'activo'),(288,597,80,499,55.00,'activo'),(289,596,79,1482,80.00,'activo'),(290,595,78,499,55.00,'activo'),(291,594,77,499,55.00,'activo'),(292,593,76,499,55.00,'activo'),(293,592,75,499,55.00,'activo'),(294,591,74,499,55.00,'activo'),(295,590,73,499,55.00,'activo'),(296,589,72,499,55.00,'activo'),(297,588,71,1407,78.00,'activo'),(298,587,70,499,55.00,'activo'),(299,586,69,1195,72.00,'activo'),(300,585,68,1577,82.00,'activo'),(301,584,67,499,55.00,'activo'),(302,583,66,499,55.00,'activo'),(303,582,65,499,55.00,'activo'),(304,581,64,10447,304.00,'activo'),(305,580,63,499,55.00,'activo'),(306,579,62,499,55.00,'activo'),(307,578,61,499,55.00,'activo'),(308,577,60,810,63.00,'activo'),(309,576,59,946,66.00,'activo'),(310,575,58,499,55.00,'activo'),(311,574,172,499,55.00,'activo'),(312,573,56,758,61.00,'activo'),(313,572,55,1764,87.00,'activo'),(314,571,54,499,55.00,'activo'),(315,570,53,499,55.00,'activo'),(316,569,52,1735,86.00,'activo'),(317,568,51,644,59.00,'activo'),(318,567,50,499,55.00,'activo'),(319,566,49,499,55.00,'activo'),(320,565,48,499,55.00,'activo'),(321,564,47,499,55.00,'activo'),(322,563,46,499,55.00,'activo'),(323,562,45,1617,83.00,'activo'),(324,561,44,499,55.00,'activo'),(325,560,106,499,55.00,'activo'),(326,559,42,499,55.00,'activo'),(327,558,105,1163,72.00,'activo'),(328,557,40,2904,115.00,'activo'),(329,556,110,1242,74.00,'activo'),(330,555,38,686,60.00,'activo'),(331,554,37,1671,84.00,'activo'),(332,553,36,1686,85.00,'activo'),(333,552,35,712,60.00,'activo'),(334,551,34,2055,94.00,'activo'),(335,550,33,499,55.00,'activo'),(336,549,32,499,55.00,'activo'),(337,548,31,499,55.00,'activo'),(338,547,30,499,55.00,'activo'),(339,546,29,499,55.00,'activo'),(340,545,28,499,55.00,'activo'),(341,544,27,499,55.00,'activo'),(342,543,26,499,55.00,'activo'),(343,542,25,1290,75.00,'activo'),(344,541,24,1722,86.00,'activo'),(345,540,23,707,60.00,'activo'),(346,539,22,2185,97.00,'activo'),(347,538,21,499,55.00,'activo'),(348,537,20,499,55.00,'activo'),(349,536,19,499,55.00,'activo'),(350,535,18,3524,131.00,'activo'),(351,534,17,1464,79.00,'activo'),(352,533,16,1077,69.00,'activo'),(353,532,15,714,60.00,'activo'),(354,530,13,499,55.00,'activo'),(355,529,12,829,63.00,'activo'),(356,528,11,499,55.00,'activo'),(357,527,10,499,55.00,'activo'),(358,526,9,499,55.00,'activo'),(359,525,8,912,65.00,'activo'),(360,524,7,499,55.00,'activo'),(361,688,178,1536,81.00,'activo'),(362,687,177,500,55.00,'activo'),(363,686,176,500,55.00,'activo'),(364,685,175,500,55.00,'activo'),(365,684,170,500,55.00,'activo'),(366,613,14,11811,338.00,'activo'),(367,683,128,500,55.00,'activo'),(368,670,71,1418,78.00,'activo'),(369,682,84,500,55.00,'activo'),(370,681,112,500,55.00,'activo'),(371,680,82,500,55.00,'activo'),(372,679,81,500,55.00,'activo'),(373,678,80,500,55.00,'activo'),(374,677,79,1520,81.00,'activo'),(375,676,78,500,55.00,'activo'),(376,675,77,500,55.00,'activo'),(377,674,76,500,55.00,'activo'),(378,673,75,1151,71.00,'activo'),(379,672,74,500,55.00,'activo'),(380,671,73,500,55.00,'activo'),(381,669,70,500,55.00,'activo'),(382,668,69,1102,70.00,'activo'),(383,667,68,1454,79.00,'activo'),(384,666,67,55,55.00,'activo'),(385,665,66,500,55.00,'activo'),(386,664,65,500,55.00,'activo'),(387,663,64,10729,311.00,'activo'),(388,662,63,500,55.00,'activo'),(389,661,62,500,55.00,'activo'),(390,660,61,500,55.00,'activo'),(391,659,60,839,63.00,'activo'),(392,658,59,666,59.00,'activo'),(393,657,58,500,55.00,'activo'),(394,656,172,600,58.00,'activo'),(395,655,56,650,59.00,'activo'),(396,654,55,1678,84.00,'activo'),(397,653,54,500,55.00,'activo'),(398,652,53,500,55.00,'activo'),(399,651,52,2159,96.00,'activo'),(400,650,51,749,61.00,'activo'),(401,649,50,500,55.00,'activo'),(402,648,49,500,55.00,'activo'),(403,647,48,500,55.00,'activo'),(404,645,46,500,55.00,'activo'),(405,644,45,1613,83.00,'activo'),(406,643,44,500,55.00,'activo'),(407,642,106,500,55.00,'activo'),(408,641,42,500,55.00,'activo'),(409,640,105,1369,77.00,'activo'),(410,639,40,2462,104.00,'activo'),(411,638,110,1699,85.00,'activo'),(412,637,38,1415,78.00,'activo'),(413,636,37,1662,84.00,'activo'),(414,635,36,1506,80.00,'activo'),(415,634,35,582,57.00,'activo'),(416,633,34,1973,92.00,'activo'),(417,632,33,500,55.00,'activo'),(418,631,32,500,55.00,'activo'),(419,630,31,500,55.00,'activo'),(420,629,30,500,55.00,'activo'),(421,628,29,500,55.00,'activo'),(422,627,28,500,55.00,'activo'),(423,626,27,500,55.00,'activo'),(424,625,26,500,55.00,'activo'),(425,624,25,1293,75.00,'activo'),(426,623,24,1674,84.00,'activo'),(427,622,23,749,61.00,'activo'),(428,621,22,2297,100.00,'activo'),(429,620,21,500,55.00,'activo'),(430,619,20,500,55.00,'activo'),(431,618,19,884,65.00,'activo'),(432,617,18,3665,134.00,'activo'),(433,616,17,1379,77.00,'activo'),(434,615,16,711,60.00,'activo'),(435,614,15,738,61.00,'activo'),(436,612,13,500,55.00,'activo'),(437,611,12,1030,68.00,'activo'),(438,610,11,500,55.00,'activo'),(439,609,10,500,55.00,'activo'),(440,608,9,500,55.00,'activo'),(441,607,8,763,62.00,'activo'),(442,606,7,500,55.00,'activo');
/*!40000 ALTER TABLE `tb007_detalle_cobranza` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb008_lotes_archivados`
--

DROP TABLE IF EXISTS `tb008_lotes_archivados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tb008_lotes_archivados` (
  `I008ID_REPORTE` int(11) NOT NULL AUTO_INCREMENT,
  `I003ID_PERIODOS` int(11) DEFAULT NULL,
  `F008FECHA_REPORTE` timestamp NOT NULL DEFAULT current_timestamp(),
  `D008MONTO_TOTAL` decimal(10,2) DEFAULT NULL,
  `I008CANTIDAD_REGISTROS` int(11) DEFAULT NULL,
  `V008OPERADOR` varchar(100) DEFAULT NULL,
  `V008PERIODO_TEXTO` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`I008ID_REPORTE`),
  KEY `I003ID_PERIODOS` (`I003ID_PERIODOS`),
  CONSTRAINT `tb008_lotes_archivados_ibfk_1` FOREIGN KEY (`I003ID_PERIODOS`) REFERENCES `tb003_periodos` (`I003ID_PERIODOS`)
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb008_lotes_archivados`
--

LOCK TABLES `tb008_lotes_archivados` WRITE;
/*!40000 ALTER TABLE `tb008_lotes_archivados` DISABLE KEYS */;
INSERT INTO `tb008_lotes_archivados` VALUES (58,1,'2026-03-18 18:40:18',117.50,1,'admin','Marzo 2026'),(59,1,'2026-03-18 20:23:31',212.23,1,'admin','Marzo 2026'),(60,1,'2026-03-18 20:39:37',92.50,1,'admin','Marzo 2026'),(61,1,'2026-03-18 20:46:37',377.50,3,'admin','Marzo 2026'),(62,1,'2026-03-18 21:24:17',374.92,3,'admin','Marzo 2026'),(63,1,'2026-03-18 21:32:44',92.50,1,'admin','Marzo 2026'),(64,1,'2026-03-18 21:45:11',55.00,1,'admin','Marzo 2026'),(65,1,'2026-03-19 19:06:47',260.00,4,'admin','Marzo 2026'),(66,1,'2026-03-19 21:18:23',514.43,6,'admin','Marzo 2026'),(67,1,'2026-03-19 22:01:58',265.55,4,'admin','Marzo 2026'),(68,1,'2026-03-19 22:40:57',92.50,1,'admin','Marzo 2026'),(69,1,'2026-03-20 00:05:14',150.00,1,'admin','Marzo 2026'),(70,1,'2026-04-18 19:09:47',4314.81,63,'admin','Marzo 2026'),(71,1,'2026-04-18 19:38:32',1207.53,17,'admin','Marzo 2026'),(72,7,'2026-05-19 19:48:08',5588.00,80,'admin','Abril 2026');
/*!40000 ALTER TABLE `tb008_lotes_archivados` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb009_lotes_detallado`
--

DROP TABLE IF EXISTS `tb009_lotes_detallado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tb009_lotes_detallado` (
  `I009ID_HISTORIAL` int(11) NOT NULL AUTO_INCREMENT,
  `I008ID_REPORTE` int(11) DEFAULT NULL,
  `V009NOMBRE_CLIENTE` varchar(150) DEFAULT NULL,
  `V009RUC` varchar(150) DEFAULT NULL,
  `D009MONTO` decimal(10,2) DEFAULT NULL,
  `V009METODO` varchar(50) DEFAULT NULL,
  `F009FECHA_PAGO` datetime DEFAULT NULL,
  `V009OPERADOR` varchar(100) DEFAULT NULL,
  `V009CELULAR` varchar(150) DEFAULT NULL,
  `I009CANTIDAD_DOCS` int(11) DEFAULT 0,
  `V009PERIODO` varchar(100) DEFAULT NULL,
  `F009FECHA_ARCHIVO` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`I009ID_HISTORIAL`),
  KEY `I008ID_REPORTE` (`I008ID_REPORTE`),
  CONSTRAINT `tb009_lotes_detallado_ibfk_1` FOREIGN KEY (`I008ID_REPORTE`) REFERENCES `tb008_lotes_archivados` (`I008ID_REPORTE`)
) ENGINE=InnoDB AUTO_INCREMENT=313 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb009_lotes_detallado`
--

LOCK TABLES `tb009_lotes_detallado` WRITE;
/*!40000 ALTER TABLE `tb009_lotes_detallado` DISABLE KEYS */;
INSERT INTO `tb009_lotes_detallado` VALUES (153,70,'GRUPO JR PACCO S.A.C','20611052953',63.00,'BCP (transferencia)','2026-03-24 10:09:23','admin','931352788',826,'Marzo 2026','2026-04-18 19:09:47'),(154,70,'pepe tiburon','20614309726',55.00,'BCP (transferencia)','2026-03-24 10:09:23','admin','931352788',499,'Marzo 2026','2026-04-18 19:09:47'),(155,70,'ARIZONA COMPANY E.I.R.L','20611110848',55.00,'Yape','2026-03-24 10:13:51','admin','953 317 714',499,'Marzo 2026','2026-04-18 19:09:47'),(156,70,'ARATA SANCHEZ ANA MARIA','10154207487',65.00,'Yape','2026-03-24 10:13:51','admin','953 317 714',909,'Marzo 2026','2026-04-18 19:09:47'),(157,70,'PEREZ CALLA├æAUPA JORGE ARMANDO','10456581299',55.00,'Yape','2026-03-20 16:52:16','admin','936 174 184',499,'Marzo 2026','2026-04-18 19:09:47'),(158,70,'EL LE├æADOR LA VICTORIA','10479143191',60.00,'Yape','2026-03-20 15:57:15','admin','950 826 356',707,'Marzo 2026','2026-04-18 19:09:47'),(159,70,'INDUSTRIA PRODUCTORA DE ALIMENTOS SIBERIA','20481703825',91.00,'Yape','2026-03-20 16:23:00','admin','976 533 915',1959,'Marzo 2026','2026-04-18 19:09:47'),(160,70,'SERVICIOS IMPORTACIONES Y EXPORTACIONES AMARO','20552706944',132.00,'BCP (transferencia)','2026-03-24 10:08:13','admin','991 698 510',3583,'Marzo 2026','2026-04-18 19:09:47'),(161,70,'& V CHIKEN NEGOCIOS S.A.C.','20407821174',55.00,'Yape','2026-03-24 10:35:39','admin','952 376 002',499,'Marzo 2026','2026-04-18 19:09:47'),(162,70,'REYES HUARCA PEDRO JAVIER','10040855519',55.00,'Yape','2026-03-24 10:35:39','admin','952 376 002',499,'Marzo 2026','2026-04-18 19:09:47'),(163,70,'PARINANGO DURAN YONATAN','10474292385',55.00,'Yape','2026-03-20 16:23:17','admin','982 445 870',499,'Marzo 2026','2026-04-18 19:09:47'),(164,70,'INVERSIONES ZARELLE E.I.R.L.','20549036776',94.00,'Plin','2026-03-24 10:59:23','admin','951 865 930',2069,'Marzo 2026','2026-04-18 19:09:47'),(165,70,'Cliente SIN NOMBRE 20614833387','20614833387',61.00,'Plin','2026-03-24 10:59:23','admin','951 865 930',755,'Marzo 2026','2026-04-18 19:09:47'),(166,70,'INVERSIONES DON NICOLAS E.I.R.L.','20613496301',83.00,'Plin','2026-03-24 10:59:23','admin','951 865 930',1608,'Marzo 2026','2026-04-18 19:09:47'),(167,70,'COLQUE ESCOBEDO KAROL CANDY','10412495182',55.00,'Yape','2026-03-24 10:12:51','admin','958 060 987',499,'Marzo 2026','2026-04-18 19:09:47'),(168,70,'RIOS MINAYA MARCOS ABEL','10431799702',55.00,'Yape','2026-03-24 10:12:51','admin','958 060 987',499,'Marzo 2026','2026-04-18 19:09:47'),(169,70,'BARRAZA AGUILAR PILAR DEL ROSARIO','10087546565',55.00,'Yape','2026-03-24 10:35:23','admin','964 226 038',499,'Marzo 2026','2026-04-18 19:09:47'),(170,70,'marko polleria','10464140331',55.00,'Yape','2026-03-24 10:35:23','admin','964 226 038',499,'Marzo 2026','2026-04-18 19:09:47'),(171,70,'CULQUI DIAZ CARLOMAN - nuevo ruc','20613999460',55.00,'Yape','2026-03-24 10:10:58','admin','950103029',499,'Marzo 2026','2026-04-18 19:09:47'),(172,70,'FLORES ACEVEDO','10206628532',55.00,'Yape','2026-03-24 10:03:25','admin','955 018 264',499,'Marzo 2026','2026-04-18 19:09:47'),(173,70,'MARTINEZ CARDENAS GREGORIA LEONOR','10205643112',55.00,'Yape','2026-03-24 10:03:25','admin','955 018 264',499,'Marzo 2026','2026-04-18 19:09:47'),(174,70,'EROMANIA E.I.R.L.','20609099314',86.00,'Yape','2026-03-20 16:22:39','admin','935 571 601',1757,'Marzo 2026','2026-04-18 19:09:47'),(175,70,'AGUILAR DE ROMANI MARINA MAXIMILIANA','10285689070',59.00,'Yape','2026-03-20 16:22:39','admin','935 571 601',677,'Marzo 2026','2026-04-18 19:09:47'),(176,70,'CORPORACION TEAM R.A. E.I.R.L.','20608602195',83.00,'Yape','2026-03-20 16:22:39','admin','935 571 601',1634,'Marzo 2026','2026-04-18 19:09:47'),(177,70,'CORPORACION YAMARO E.I.R.L.','20608560212',78.00,'Yape','2026-03-20 16:22:39','admin','935 571 601',1421,'Marzo 2026','2026-04-18 19:09:47'),(178,70,'ruc nuevo  cobranza de julio','20614403820',57.00,'Yape','2026-03-20 16:22:39','admin','935 571 601',563,'Marzo 2026','2026-04-18 19:09:47'),(179,70,'nuevo ruc bocana (BOCANA SUITES)','20611868872',70.00,'Interbank','2026-03-20 17:34:11','admin','965 835 006',1098,'Marzo 2026','2026-04-18 19:09:47'),(180,70,'NEGOCIOS W & P SOCIEDAD COMERCIAL DE RESPONSABILIDAD LIMITADA','20609191580',117.00,'Interbank','2026-03-20 17:34:11','admin','965 835 006',2986,'Marzo 2026','2026-04-18 19:09:47'),(181,70,'Sin nombre 20614315742 (WM & CO. E.I.R)','20614315742',55.00,'Interbank','2026-03-20 17:34:11','admin','965 835 006',499,'Marzo 2026','2026-04-18 19:09:47'),(182,70,'REDECUY TRADICION Y SABOR S.A.C. 934 144 218  nuevo numero','20608780786',55.00,'Yape','2026-03-24 10:45:56','admin','934 144 218',499,'Marzo 2026','2026-04-18 19:09:47'),(183,70,'PIZZEROS ARTESANALES BONAPARTE S.R.L','20610894381',55.00,'Yape','2026-03-24 09:44:55','admin','978 728 142',499,'Marzo 2026','2026-04-18 19:09:47'),(184,70,'TINEO MINA RUTH MILAGROS','10482363445',55.00,'Yape','2026-03-24 10:44:53','admin','927 112 774',499,'Marzo 2026','2026-04-18 19:09:47'),(185,70,'CORPORACION BRAYAN & LUCERO E.I.R.L.','20606176563',55.00,'Yape','2026-03-24 10:12:28','admin','922 928 461',499,'Marzo 2026','2026-04-18 19:09:47'),(186,70,'CHAVEZ BLAS NAVARRO ELLIS','10459270880',57.00,'Yape','2026-03-24 09:41:51','admin','950 951 870',585,'Marzo 2026','2026-04-18 19:09:47'),(187,70,'CORPORACION E & G PERU S.A.C.','20607507628',84.00,'Yape','2026-03-20 17:24:35','admin','983 657 886',1645,'Marzo 2026','2026-04-18 19:09:47'),(188,70,'CADILLO SOTO JUDITH GIOVANNA','10475209988',82.00,'Yape','2026-03-20 15:53:53','admin','948 140 363',1568,'Marzo 2026','2026-04-18 19:09:47'),(189,70,'RAFAELE BARRIAL JHON MARCELINO','10458406087',55.00,'Yape','2026-03-24 09:44:08','admin','934 991 783',499,'Marzo 2026','2026-04-18 19:09:47'),(190,70,'BARRIAL MEJIA ALEJANDRA','10285897128',83.00,'Yape','2026-03-24 09:44:08','admin','934 991 783',1607,'Marzo 2026','2026-04-18 19:09:47'),(191,70,'INVERSIONES GENERALES & NEGOCIOS CORPORATIVOS HMNOS CENTRAL S.A.C','20607810983',61.00,'Yape','2026-03-20 18:35:59','admin','977 851 754',738,'Marzo 2026','2026-04-18 19:09:47'),(192,70,'P\'LUIS EMPRESA INDIVIDUAL DE RESPONSABILIDAD LIMITADA','20606861452',62.42,'Yape','2026-03-24 10:09:42','admin','966 305 984',797,'Marzo 2026','2026-04-18 19:09:47'),(193,70,'INVERSIONESS RL & JJ S.A.C.','20600220650',64.47,'Yape','2026-03-24 10:14:06','admin','969 742 362 - 930 90',879,'Marzo 2026','2026-04-18 19:09:47'),(194,70,'GRUPO CARBONEL S.A.C','20606865032',60.90,'Yape','2026-03-24 09:59:35','admin','956 327 786',736,'Marzo 2026','2026-04-18 19:09:47'),(195,70,'DOMINGUEZ FIGUEROA ZOAILA JESUS','10436249832',56.38,'Yape','2026-03-24 10:59:43','admin','936 325 778',555,'Marzo 2026','2026-04-18 19:09:47'),(196,70,'JACKY\'S FRESH MARKET E.I.R.L','20606121939',55.00,'Yape','2026-03-24 10:10:10','admin','984 569 218',499,'Marzo 2026','2026-04-18 19:09:47'),(197,70,'chic chic nuevo','10458784308',79.53,'Yape','2026-03-20 15:45:37','admin','946 608 531 -  946 6',1481,'Marzo 2026','2026-04-18 19:09:47'),(198,70,'POLLERIA MEJIA','10460750411',69.70,'Tranferencia BCP','2026-03-20 18:44:58','admin','976 671 170',1088,'Marzo 2026','2026-04-18 19:09:47'),(199,70,'Cliente SIN NOMBRE 10159965801','10159965801',55.00,'Tranferencia BCP','2026-03-20 18:44:58','admin','976 671 170',499,'Marzo 2026','2026-04-18 19:09:47'),(200,70,'encuentro de los andes','20612092941',66.15,'Yape','2026-03-24 09:40:35','admin','975 125 372',946,'Marzo 2026','2026-04-18 19:09:47'),(201,70,'haki','10904921861',55.00,'Yape','2026-03-24 17:02:13','admin','976 571 212',499,'Marzo 2026','2026-04-18 19:09:47'),(202,70,'Raul Ocon SABORES CUSQUE├æOS','20612062693',55.00,'Yape','2026-03-20 15:19:20','admin','955 290 294',499,'Marzo 2026','2026-04-18 19:09:47'),(203,70,'xiomara roxishop','20612356301',72.03,'Yape','2026-03-24 10:41:46','admin','987 789 868',1181,'Marzo 2026','2026-04-18 19:09:47'),(204,70,'EL LE├æADOR PANGOA SOCIEDAD ANONIMA','20612484351',55.00,'Yape','2026-03-20 15:24:47','admin','938 730 769',499,'Marzo 2026','2026-04-18 19:09:47'),(205,70,'kevin cordoba','20612587761',55.00,'Yape','2026-03-24 10:58:25','admin','984 331 886',499,'Marzo 2026','2026-04-18 19:09:47'),(206,70,'19 diciembre PATATAS PERU','20613457501',55.00,'Yape','2026-03-20 15:07:17','admin','967 266 067',499,'Marzo 2026','2026-04-18 19:09:47'),(207,70,'ENYEL SOCIEDAD ANONIMA CERRADA(programador market) gerente susana encargada','20612662143',77.90,'Yape','2026-03-24 12:20:55','admin','947 304 755',1416,'Marzo 2026','2026-04-18 19:09:47'),(208,70,'nuevo ruc arcas','20607554511',55.00,'Yape','2026-03-20 17:38:18','admin','959 659 747',499,'Marzo 2026','2026-04-18 19:09:47'),(209,70,'cabrera rubio claudia recomendado por ajies','10427497076',55.00,'Yape','2026-03-20 15:06:13','admin','992 167 132',499,'Marzo 2026','2026-04-18 19:09:47'),(210,70,'LOZANO RIVERO FIDEL EDGAR','10067473979',57.08,'Yape','2026-03-24 11:55:45','admin','934 960 642',583,'Marzo 2026','2026-04-18 19:09:47'),(211,70,'RECREO CAMPESTRE DON LADI S.A.C.','20615016501',61.25,'Yape','2026-03-24 09:43:25','admin','921931060',750,'Marzo 2026','2026-04-18 19:09:47'),(212,70,'EL LE├æADOR JV E.I.R.L','20610523421',309.00,'BCP','2026-03-20 15:47:30','admin','959 585 074',10655,'Marzo 2026','2026-04-18 19:09:47'),(213,70,'CORPORACI├ôN LE├æADOR JV S.A.C.','20615052443',55.00,'BCP','2026-03-20 15:47:30','admin','959 585 074',7,'Marzo 2026','2026-04-18 19:09:47'),(214,70,'DON PEPE┬┤S POLLOS & PARRILLAS S.R.L.','20605002600',55.00,'Yape','2026-03-24 15:18:57','admin','929 205 059',499,'Marzo 2026','2026-04-18 19:09:47'),(215,70,'THE GREAT WINGS FAST FOOD E.I.R.L.','20607629316',62.00,'BCP (transferencia)','2026-03-24 10:13:33','admin','1 973 836 3876',797,'Marzo 2026','2026-04-18 19:09:47'),(216,71,'INVERCIONES ALJAM S.A.C','20611382511',55.00,'Yape,Plin o trasferencia','2026-04-18 14:38:16','admin','982 988 646',499,'Marzo 2026','2026-04-18 19:38:32'),(217,71,'CORPORACION VC S.A.C','20609648199',55.00,'Yape,Plin o trasferencia','2026-04-18 14:38:16','admin','974 436 748',499,'Marzo 2026','2026-04-18 19:38:32'),(218,71,'CORPORACION TRATTORIA V & L E.I.R.L.(pizzeriamancosegundo)','20612897990',76.00,'Yape,Plin o trasferencia','2026-04-18 14:38:16','admin','983 346 990',1327,'Marzo 2026','2026-04-18 19:38:32'),(219,71,'CORPORACION MAVIK E.I.R.L   sede surco','20609170850',73.00,'Yape,Plin o trasferencia','2026-04-18 14:38:16','admin','976 503 940',1204,'Marzo 2026','2026-04-18 19:38:32'),(220,71,'HUERTA PAICO WALTER WILIAM','10467091421',55.00,'Yape,Plin o trasferencia','2026-04-18 14:38:16','admin','963 539 029',499,'Marzo 2026','2026-04-18 19:38:32'),(221,71,'VICU├æA CALDERON CESAR ANTONIO','10072548863',68.00,'Yape,Plin o trasferencia','2026-04-18 14:38:16','admin','936 800 038',1012,'Marzo 2026','2026-04-18 19:38:32'),(222,71,'polleria el gordito','10321146371',55.00,'Yape,Plin o trasferencia','2026-04-18 14:38:16','admin','936 800 038',499,'Marzo 2026','2026-04-18 19:38:32'),(223,71,'GROUP INVERSIONES LA MAMASA E.I.R.L.','20608509187',55.00,'Yape,Plin o trasferencia','2026-04-18 14:38:16','admin','924 599 135',499,'Marzo 2026','2026-04-18 19:38:32'),(224,71,'CASTILLO CARBAJAL JORGE LUIS','10450548176',55.00,'Yape,Plin o trasferencia','2026-04-18 14:38:16','admin','993 112 705',499,'Marzo 2026','2026-04-18 19:38:32'),(225,71,'CADILLO SOTO VILCA CHIC CHIC zapallal y ovalo zapallal','10425964807',55.00,'Yape,Plin o trasferencia','2026-04-18 14:38:16','admin','940 422 674',499,'Marzo 2026','2026-04-18 19:38:32'),(226,71,'WACCES.IMPORT E.I.R.L.','20605698787',253.38,'Yape,Plin o trasferencia','2026-04-18 14:38:16','admin','955 373 406',8435,'Marzo 2026','2026-04-18 19:38:32'),(227,71,'platinium','20609904225',76.65,'Yape,Plin o trasferencia','2026-04-18 14:38:16','admin','908 926 792',1366,'Marzo 2026','2026-04-18 19:38:32'),(228,71,'RECHARTER 21/05/2025','10455175246',55.00,'Yape,Plin o trasferencia','2026-04-18 14:38:16','admin','908 926 792',499,'Marzo 2026','2026-04-18 19:38:32'),(229,71,'gladis SABOR A FUEGO','10444120253',55.50,'Yape,Plin o trasferencia','2026-04-18 14:38:16','admin','986 486 361',520,'Marzo 2026','2026-04-18 19:38:32'),(230,71,'hamburgueceria alfredo','20613180584',55.00,'Yape,Plin o trasferencia','2026-04-18 14:38:16','admin','972811078',499,'Marzo 2026','2026-04-18 19:38:32'),(231,71,'facturador juliaca','20614021722',55.00,'Yape,Plin o trasferencia','2026-04-18 14:38:16','admin','943 717 182',499,'Marzo 2026','2026-04-18 19:38:32'),(232,71,'INVERSIONES CERVECERAS MR S.A.C.','20605785043',55.00,'Yape,Plin o trasferencia','2026-04-18 14:38:16','admin','932338127',499,'Marzo 2026','2026-04-18 19:38:32'),(233,72,'INVERCIONES ALJAM S.A.C','20611382511',55.00,'Yape','2026-04-21 18:08:26','admin','982 988 646',499,'Abril 2026','2026-05-19 19:48:08'),(234,72,'GRUPO JR PACCO S.A.C','20611052953',65.00,'Yape','2026-04-18 16:26:39','admin','931352788',912,'Abril 2026','2026-05-19 19:48:08'),(235,72,'pepe tiburon','20614309726',55.00,'Yape','2026-04-18 16:26:39','admin','931352788',499,'Abril 2026','2026-05-19 19:48:08'),(236,72,'CORPORACION VC S.A.C','20609648199',55.00,'Yape','2026-04-23 22:19:40','admin','974 436 748',499,'Abril 2026','2026-05-19 19:48:08'),(237,72,'ARIZONA COMPANY E.I.R.L','20611110848',55.00,'Yape','2026-04-20 16:48:59','admin','953 317 714',499,'Abril 2026','2026-05-19 19:48:08'),(238,72,'ARATA SANCHEZ ANA MARIA','10154207487',63.00,'Yape','2026-04-20 16:48:59','admin','953 317 714',829,'Abril 2026','2026-05-19 19:48:08'),(239,72,'PEREZ CALLA├æAUPA JORGE ARMANDO','10456581299',55.00,'Yape','2026-04-19 07:04:27','admin','936 174 184',499,'Abril 2026','2026-05-19 19:48:08'),(240,72,'EL LE├æADOR JV E.I.R.L','20610523421',343.00,'INTERBANK EMPRESA','2026-04-20 17:20:37','admin','959 585 074',12029,'Abril 2026','2026-05-19 19:48:08'),(241,72,'EL LE├æADOR LA VICTORIA','10479143191',60.00,'Yape','2026-04-18 17:12:42','admin','950 826 356',714,'Abril 2026','2026-05-19 19:48:08'),(242,72,'INDUSTRIA PRODUCTORA DE ALIMENTOS SIBERIA','20481703825',69.00,'Yape','2026-04-19 07:00:06','admin','976 533 915',1077,'Abril 2026','2026-05-19 19:48:08'),(243,72,'CORPORACION TRATTORIA V & L E.I.R.L.(pizzeriamancosegundo)','20612897990',79.00,'BBVA','2026-04-20 22:40:21','admin','983 346 990',1464,'Abril 2026','2026-05-19 19:48:08'),(244,72,'SERVICIOS IMPORTACIONES Y EXPORTACIONES AMARO','20552706944',131.00,'Yape','2026-04-19 16:46:44','admin','991 698 510',3524,'Abril 2026','2026-05-19 19:48:08'),(245,72,'& V CHIKEN NEGOCIOS S.A.C.','20407821174',55.00,'Yape','2026-04-20 17:13:51','admin','952 376 002',499,'Abril 2026','2026-05-19 19:48:08'),(246,72,'REYES HUARCA PEDRO JAVIER','10040855519',55.00,'Yape','2026-04-20 17:13:51','admin','952 376 002',499,'Abril 2026','2026-05-19 19:48:08'),(247,72,'PARINANGO DURAN YONATAN','10474292385',55.00,'Yape','2026-04-18 16:16:00','admin','982 445 870',499,'Abril 2026','2026-05-19 19:48:08'),(248,72,'INVERSIONES ZARELLE E.I.R.L.','20549036776',97.00,'Yape','2026-04-20 16:14:36','admin','951 865 930',2185,'Abril 2026','2026-05-19 19:48:08'),(249,72,'Cliente SIN NOMBRE 20614833387','20614833387',60.00,'Yape','2026-04-20 16:14:36','admin','951 865 930',707,'Abril 2026','2026-05-19 19:48:08'),(250,72,'INVERSIONES DON NICOLAS E.I.R.L.','20613496301',86.00,'Yape','2026-04-20 16:14:36','admin','951 865 930',1722,'Abril 2026','2026-05-19 19:48:08'),(251,72,'CORPORACION MAVIK E.I.R.L   sede surco','20609170850',75.00,'Yape','2026-04-19 07:03:47','admin','976 503 940',1290,'Abril 2026','2026-05-19 19:48:08'),(252,72,'HUERTA PAICO WALTER WILIAM','10467091421',55.00,'Yape','2026-04-18 17:42:16','admin','963 539 029',499,'Abril 2026','2026-05-19 19:48:08'),(253,72,'COLQUE ESCOBEDO KAROL CANDY','10412495182',55.00,'Yape','2026-04-20 16:40:46','admin','958 060 987',499,'Abril 2026','2026-05-19 19:48:08'),(254,72,'RIOS MINAYA MARCOS ABEL','10431799702',55.00,'Yape','2026-04-20 16:40:46','admin','958 060 987',499,'Abril 2026','2026-05-19 19:48:08'),(255,72,'BARRAZA AGUILAR PILAR DEL ROSARIO','10087546565',55.00,'Yape','2026-04-23 20:26:55','admin','964 226 038',499,'Abril 2026','2026-05-19 19:48:08'),(256,72,'marko polleria','10464140331',55.00,'Yape','2026-04-23 20:26:55','admin','964 226 038',499,'Abril 2026','2026-05-19 19:48:08'),(257,72,'CULQUI DIAZ CARLOMAN - nuevo ruc','20613999460',55.00,'Yape','2026-04-20 16:39:38','admin','950103029',499,'Abril 2026','2026-05-19 19:48:08'),(258,72,'FLORES ACEVEDO','10206628532',55.00,'BCP','2026-04-21 11:36:05','admin','955 018 264',499,'Abril 2026','2026-05-19 19:48:08'),(259,72,'MARTINEZ CARDENAS GREGORIA LEONOR','10205643112',55.00,'BCP','2026-04-21 11:36:05','admin','955 018 264',499,'Abril 2026','2026-05-19 19:48:08'),(260,72,'EROMANIA E.I.R.L.','20609099314',94.00,'Yape','2026-04-18 17:13:34','admin','935 571 601',2055,'Abril 2026','2026-05-19 19:48:08'),(261,72,'AGUILAR DE ROMANI MARINA MAXIMILIANA','10285689070',60.00,'Yape','2026-04-18 17:13:34','admin','935 571 601',712,'Abril 2026','2026-05-19 19:48:08'),(262,72,'CORPORACION TEAM R.A. E.I.R.L.','20608602195',85.00,'Yape','2026-04-18 17:13:34','admin','935 571 601',1686,'Abril 2026','2026-05-19 19:48:08'),(263,72,'CORPORACION YAMARO E.I.R.L.','20608560212',84.00,'Yape','2026-04-18 17:13:34','admin','935 571 601',1671,'Abril 2026','2026-05-19 19:48:08'),(264,72,'ruc nuevo  cobranza de julio','20614403820',60.00,'Yape','2026-04-18 17:13:34','admin','935 571 601',686,'Abril 2026','2026-05-19 19:48:08'),(265,72,'nuevo ruc bocana (BOCANA SUITES)','20611868872',74.00,'Yape','2026-04-18 17:13:55','admin','965 835 006',1242,'Abril 2026','2026-05-19 19:48:08'),(266,72,'NEGOCIOS W & P SOCIEDAD COMERCIAL DE RESPONSABILIDAD LIMITADA','20609191580',115.00,'Yape','2026-04-18 17:13:55','admin','965 835 006',2904,'Abril 2026','2026-05-19 19:48:08'),(267,72,'Sin nombre 20614315742 (WM & CO. E.I.R)','20614315742',72.00,'Yape','2026-04-18 17:13:55','admin','965 835 006',1163,'Abril 2026','2026-05-19 19:48:08'),(268,72,'INVERSIONES CERVECERAS MR S.A.C.','20605785043',55.00,'Yape','2026-04-22 07:45:26','admin','932338127',499,'Abril 2026','2026-05-19 19:48:08'),(269,72,'REDECUY TRADICION Y SABOR S.A.C. 934 144 218  nuevo numero','20608780786',55.00,'Yape','2026-04-18 15:56:19','admin','934 144 218',499,'Abril 2026','2026-05-19 19:48:08'),(270,72,'PIZZEROS ARTESANALES BONAPARTE S.R.L','20610894381',55.00,'Yape','2026-05-04 16:46:44','admin','978 728 142',499,'Abril 2026','2026-05-19 19:48:08'),(271,72,'VICU├æA CALDERON CESAR ANTONIO','10072548863',83.00,'Yape','2026-04-18 15:55:29','admin','936 800 038',1617,'Abril 2026','2026-05-19 19:48:08'),(272,72,'polleria el gordito','10321146371',55.00,'Yape','2026-04-18 15:55:29','admin','936 800 038',499,'Abril 2026','2026-05-19 19:48:08'),(273,72,'CASTILLO CARBAJAL JORGE LUIS','10450548176',55.00,'Yape','2026-04-23 20:25:02','admin','993 112 705',499,'Abril 2026','2026-05-19 19:48:08'),(274,72,'TINEO MINA RUTH MILAGROS','10482363445',55.00,'Yape','2026-04-20 17:14:43','admin','927 112 774',499,'Abril 2026','2026-05-19 19:48:08'),(275,72,'CORPORACION BRAYAN & LUCERO E.I.R.L.','20606176563',55.00,'Yape','2026-04-21 09:05:25','admin','922 928 461',499,'Abril 2026','2026-05-19 19:48:08'),(276,72,'CHAVEZ BLAS NAVARRO ELLIS','10459270880',59.00,'Yape','2026-04-20 17:16:03','admin','950 951 870',644,'Abril 2026','2026-05-19 19:48:08'),(277,72,'CORPORACION E & G PERU S.A.C.','20607507628',86.00,'Yape','2026-04-18 16:25:48','admin','983 657 886',1735,'Abril 2026','2026-05-19 19:48:08'),(278,72,'CADILLO SOTO JUDITH GIOVANNA','10475209988',55.00,'Yape','2026-04-18 17:13:14','admin','948 140 363',499,'Abril 2026','2026-05-19 19:48:08'),(279,72,'RAFAELE BARRIAL JHON MARCELINO','10458406087',55.00,'Yape','2026-04-20 17:28:03','admin','934 991 783',499,'Abril 2026','2026-05-19 19:48:08'),(280,72,'BARRIAL MEJIA ALEJANDRA','10285897128',87.00,'Yape','2026-04-20 17:28:03','admin','934 991 783',1764,'Abril 2026','2026-05-19 19:48:08'),(281,72,'INVERSIONES GENERALES & NEGOCIOS CORPORATIVOS HMNOS CENTRAL S.A.C','20607810983',61.00,'Yape','2026-04-20 16:41:22','admin','977 851 754',758,'Abril 2026','2026-05-19 19:48:08'),(282,72,'THE GREAT WINGS FAST FOOD E.I.R.L.','20607629316',55.00,'Yape','2026-04-19 11:58:55','admin','1 973 836 3876',499,'Abril 2026','2026-05-19 19:48:08'),(283,72,'P\'LUIS EMPRESA INDIVIDUAL DE RESPONSABILIDAD LIMITADA','20606861452',55.00,'Yape','2026-04-20 16:40:26','admin','966 305 984',499,'Abril 2026','2026-05-19 19:48:08'),(284,72,'INVERSIONESS RL & JJ S.A.C.','20600220650',66.00,'Yape','2026-04-19 07:05:05','admin','930909005',946,'Abril 2026','2026-05-19 19:48:08'),(285,72,'GRUPO CARBONEL S.A.C','20606865032',63.00,'Yape','2026-04-19 09:09:35','admin','956 327 786',810,'Abril 2026','2026-05-19 19:48:08'),(286,72,'CADILLO SOTO VILCA CHIC CHIC zapallal y ovalo zapallal','10425964807',55.00,'BCP','2026-04-20 18:06:42','admin','940 422 674',499,'Abril 2026','2026-05-19 19:48:08'),(287,72,'DOMINGUEZ FIGUEROA ZOAILA JESUS','10436249832',55.00,'Yape','2026-04-19 07:02:00','admin','936 325 778',499,'Abril 2026','2026-05-19 19:48:08'),(288,72,'JACKY\'S FRESH MARKET E.I.R.L','20606121939',55.00,'Yape','2026-04-20 18:28:50','admin','984 569 218',499,'Abril 2026','2026-05-19 19:48:08'),(289,72,'WACCES.IMPORT E.I.R.L.','20605698787',304.00,'BCP','2026-04-20 17:14:26','admin','955 373 406',10447,'Abril 2026','2026-05-19 19:48:08'),(290,72,'DON PEPE┬┤S POLLOS & PARRILLAS S.R.L.','20605002600',55.00,'Yape','2026-04-20 18:37:23','admin','929 205 059',499,'Abril 2026','2026-05-19 19:48:08'),(291,72,'platinium','20609904225',55.00,'Yape','2026-04-23 14:04:32','admin','908 926 792',499,'Abril 2026','2026-05-19 19:48:08'),(292,72,'RECHARTER 21/05/2025','10455175246',55.00,'Yape','2026-04-23 14:04:32','admin','908 926 792',499,'Abril 2026','2026-05-19 19:48:08'),(293,72,'chic chic nuevo','10458784308',82.00,'Yape','2026-04-19 07:02:42','admin','946 608 531 -  946 6',1577,'Abril 2026','2026-05-19 19:48:08'),(294,72,'POLLERIA MEJIA','10460750411',72.00,'BCP','2026-04-20 16:40:07','admin','976 671 170',1195,'Abril 2026','2026-05-19 19:48:08'),(295,72,'Cliente SIN NOMBRE 10159965801','10159965801',55.00,'BCP','2026-04-20 16:40:07','admin','976 671 170',499,'Abril 2026','2026-05-19 19:48:08'),(296,72,'encuentro de los andes','20612092941',78.00,'BCP','2026-04-21 11:08:42','admin','975 125 372',1407,'Abril 2026','2026-05-19 19:48:08'),(297,72,'haki','10904921861',55.00,'Yape','2026-04-18 16:26:14','admin','976 571 212',499,'Abril 2026','2026-05-19 19:48:08'),(298,72,'Raul Ocon SABORES CUSQUE├æOS','20612062693',55.00,'Yape','2026-04-19 11:04:02','admin','955 290 294',499,'Abril 2026','2026-05-19 19:48:08'),(299,72,'gladis SABOR A FUEGO','10444120253',55.00,'Yape','2026-04-20 13:59:14','admin','986 486 361',499,'Abril 2026','2026-05-19 19:48:08'),(300,72,'xiomara roxishop','20612356301',55.00,'Yape','2026-04-20 13:58:38','admin','987 789 868',499,'Abril 2026','2026-05-19 19:48:08'),(301,72,'EL LE├æADOR PANGOA SOCIEDAD ANONIMA','20612484351',55.00,'Yape','2026-04-21 09:19:29','admin','938 730 769',499,'Abril 2026','2026-05-19 19:48:08'),(302,72,'kevin cordoba','20612587761',55.00,'Yape','2026-04-18 16:07:47','admin','984 331 886',499,'Abril 2026','2026-05-19 19:48:08'),(303,72,'19 diciembre PATATAS PERU','20613457501',55.00,'Yape','2026-04-19 09:10:34','admin','967 266 067',499,'Abril 2026','2026-05-19 19:48:08'),(304,72,'ENYEL SOCIEDAD ANONIMA CERRADA(programador market) gerente susana encargada','20612662143',80.00,'Yape','2026-04-20 13:55:28','admin','947 304 755',1482,'Abril 2026','2026-05-19 19:48:08'),(305,72,'nuevo ruc arcas','20607554511',55.00,'Yape','2026-04-19 07:00:43','admin','959 659 747',499,'Abril 2026','2026-05-19 19:48:08'),(306,72,'hamburgueceria alfredo','20613180584',55.00,'Yape','2026-04-20 18:26:51','admin','972811078',499,'Abril 2026','2026-05-19 19:48:08'),(307,72,'cabrera rubio claudia recomendado por ajies','10427497076',55.00,'Yape','2026-04-19 07:03:19','admin','992 167 132',500,'Abril 2026','2026-05-19 19:48:08'),(308,72,'facturador juliaca','20614021722',55.00,'Yape','2026-04-24 10:02:46','admin','943 717 182',500,'Abril 2026','2026-05-19 19:48:08'),(309,72,'LOZANO RIVERO FIDEL EDGAR','10067473979',55.00,'Yape','2026-04-22 07:46:33','admin','934 960 642',500,'Abril 2026','2026-05-19 19:48:08'),(310,72,'RECREO CAMPESTRE DON LADI S.A.C.','20615016501',55.00,'BCP','2026-04-22 13:43:24','admin','975 125 372',500,'Abril 2026','2026-05-19 19:48:08'),(311,72,'CORPORACI├ôN LE├æADOR JV S.A.C.','20615052443',55.00,'INTERBANK EMPRESA','2026-04-20 17:20:37','admin','959 585 074',500,'Abril 2026','2026-05-19 19:48:08'),(312,72,'SAZON CRIOLLO FOOD E.I.R.L.','20612832634',55.00,'Yape','2026-04-19 09:10:05','admin','963181750',500,'Abril 2026','2026-05-19 19:48:08');
/*!40000 ALTER TABLE `tb009_lotes_detallado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'sistema_cobranzas'
--
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_cambiar_estado_cliente` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_cambiar_estado_cliente`(IN `p_id_cliente` INT, IN `p_estado` VARCHAR(20))
BEGIN

    UPDATE tb002_clientes SET E002ESTADO_CLIENTE = p_estado WHERE I002ID_CLIENTE = p_id_cliente;

    UPDATE tb004_telefonos SET E004ESTADO_TELEFONO = p_estado WHERE I002ID_CLIENTE = p_id_cliente;

    UPDATE tb005_rucs SET E005ESTADO_RUC = p_estado WHERE I002ID_CLIENTE = p_id_cliente;

    UPDATE tb006_cobranzas SET E006ESTADO_COBRANZA = p_estado WHERE I002ID_CLIENTE = p_id_cliente;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_eliminar_cliente_definitivo` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_eliminar_cliente_definitivo`(IN `p_id_cliente` INT)
BEGIN

    DELETE FROM tb007_detalle_cobranza 

    WHERE I006ID_COBRANZA IN (SELECT I006ID_COBRANZA FROM tb006_cobranzas WHERE I002ID_CLIENTE = p_id_cliente);

    

    DELETE FROM tb007_detalle_cobranza

    WHERE I005ID_RUC IN (SELECT I005ID_RUC FROM tb005_rucs WHERE I002ID_CLIENTE = p_id_cliente);



    DELETE FROM tb006_cobranzas WHERE I002ID_CLIENTE = p_id_cliente;



    DELETE FROM tb005_rucs WHERE I002ID_CLIENTE = p_id_cliente;



    DELETE FROM tb004_telefonos WHERE I002ID_CLIENTE = p_id_cliente;



    DELETE FROM tb002_clientes WHERE I002ID_CLIENTE = p_id_cliente;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_guardar_cliente_completo` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_guardar_cliente_completo`(IN `p_nombre` VARCHAR(150), IN `p_telefono` VARCHAR(20), IN `p_ruc` VARCHAR(20), IN `p_razon_social` VARCHAR(200))
BEGIN

    DECLARE v_id_cliente INT;

    

    START TRANSACTION;

    

    -- Insertar cliente padre

    INSERT INTO tb002_clientes (V002NOMBRE_CLIENTE, E002ESTADO_CLIENTE) 

    VALUES (p_nombre, 'activo');

    

    SET v_id_cliente = LAST_INSERT_ID();

    

    -- Insertar tel├®fono si existe

    IF p_telefono IS NOT NULL AND p_telefono != '' THEN

        INSERT INTO tb004_telefonos (I002ID_CLIENTE, V004NUMERO, E004ESTADO_TELEFONO) 

        VALUES (v_id_cliente, p_telefono, 'activo');

    END IF;

    

    -- Insertar RUC inicial si existe

    IF p_ruc IS NOT NULL AND p_ruc != '' THEN

        INSERT INTO tb005_rucs (I002ID_CLIENTE, V005NUMERO_RUC, V005RAZON_SOCIAL, E005ESTADO_RUC) 

        VALUES (v_id_cliente, p_ruc, COALESCE(p_razon_social, p_nombre), 'activo');

    END IF;

    

    COMMIT;

    SELECT v_id_cliente as id_generado;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_obtener_basurero_clientes` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_obtener_basurero_clientes`()
BEGIN

    SELECT 

        c.I002ID_CLIENTE as id_cliente,

        c.V002NOMBRE_CLIENTE as nombre_cliente,

        c.E002ESTADO_CLIENTE as estado_cliente,

        (SELECT GROUP_CONCAT(V004NUMERO SEPARATOR ', ') FROM tb004_telefonos WHERE I002ID_CLIENTE = c.I002ID_CLIENTE) as telefonos,

        (SELECT GROUP_CONCAT(CONCAT(V005NUMERO_RUC, ' (', V005RAZON_SOCIAL, ')') SEPARATOR ' | ') FROM tb005_rucs WHERE I002ID_CLIENTE = c.I002ID_CLIENTE) as rucs

    FROM tb002_clientes c

    WHERE c.E002ESTADO_CLIENTE = 'eliminado'

    ORDER BY c.I002ID_CLIENTE DESC;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_obtener_directorio_clientes` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_obtener_directorio_clientes`()
BEGIN
                SELECT 
                    c.I002ID_CLIENTE as id_cliente,
                    c.V002NOMBRE_CLIENTE as nombre_cliente,
                    c.E002ESTADO_CLIENTE as estado_cliente,
                    (SELECT GROUP_CONCAT(DISTINCT V004NUMERO SEPARATOR ', ') FROM tb004_telefonos WHERE I002ID_CLIENTE = c.I002ID_CLIENTE AND E004ESTADO_TELEFONO = 'activo') as telefonos,
                    (SELECT GROUP_CONCAT(DISTINCT CONCAT(V005NUMERO_RUC, ' (', V005RAZON_SOCIAL, ')') SEPARATOR ' | ') FROM tb005_rucs WHERE I002ID_CLIENTE = c.I002ID_CLIENTE AND E005ESTADO_RUC = 'activo') as rucs
                FROM tb002_clientes c
                WHERE c.E002ESTADO_CLIENTE IN ('activo', 'inactivo')
                ORDER BY c.I002ID_CLIENTE DESC;
            END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_obtener_historial_pagos` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_obtener_historial_pagos`()
BEGIN
            SELECT 
                c.I006ID_COBRANZA AS id_cobranza,
                cli.V002NOMBRE_CLIENTE AS nombre_cliente,
                GROUP_CONCAT(r.V005NUMERO_RUC SEPARATOR ', ') AS ruc,
                c.D006MONTO_TOTAL AS monto_pagado,
                c.V006METODO_PAGO AS metodo,
                c.F006FECHA_PAGO AS fecha_pago,
                u.V001NOMBRE_USUARIO AS operador
            FROM tb006_cobranzas c
            INNER JOIN tb002_clientes cli ON c.I002ID_CLIENTE = cli.I002ID_CLIENTE
            LEFT JOIN tb007_detalle_cobranza dc ON c.I006ID_COBRANZA = dc.I006ID_COBRANZA
            LEFT JOIN tb005_rucs r ON dc.I005ID_RUC = r.I005ID_RUC
            LEFT JOIN tb001_usuarios u ON c.I001ID_USUARIO = u.I001ID_USUARIO
            WHERE c.E006ESTADO_COBRANZA = 'inactivo'
            GROUP BY c.I006ID_COBRANZA
            ORDER BY c.F006FECHA_PAGO DESC;
        END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_obtener_pendientes_n8n` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_obtener_pendientes_n8n`()
BEGIN

    SELECT 

        c.I006ID_COBRANZA AS id_cobranza,

        cl.V002NOMBRE_CLIENTE AS nombre_cliente,

        t.V004NUMERO AS numero_whatsapp,

        c.D006MONTO_TOTAL AS monto_total,

        p.V003DESCRIPCION AS periodo,

        (

            SELECT GROUP_CONCAT(CONCAT(r.V005NUMERO_RUC, ' S/', FORMAT(dc.D007MONTO_PAGAR, 2)) SEPARATOR ' ')

            FROM tb007_detalle_cobranza dc

            INNER JOIN tb005_rucs r ON dc.I005ID_RUC = r.I005ID_RUC

            WHERE dc.I006ID_COBRANZA = c.I006ID_COBRANZA

        ) AS rucs_detalle

    FROM 

        tb006_cobranzas c

    INNER JOIN tb002_clientes cl ON c.I002ID_CLIENTE = cl.I002ID_CLIENTE

    INNER JOIN tb004_telefonos t ON cl.I002ID_CLIENTE = t.I002ID_CLIENTE

    INNER JOIN tb003_periodos p ON c.I003ID_PERIODOS = p.I003ID_PERIODOS

    WHERE 

        c.E006ESTADO_COBRANZA = 'activo' 

        AND t.E004ESTADO_TELEFONO = 'activo';

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_registrar_pago_inteligente` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_registrar_pago_inteligente`(IN `p_numero_telefono` VARCHAR(255), IN `p_monto` DECIMAL(10,2), IN `p_metodo` VARCHAR(50))
BEGIN
                DECLARE v_id_cobranza_exacta INT DEFAULT NULL;
                DECLARE v_suma_total_grupo DECIMAL(10,2) DEFAULT 0;
                DECLARE v_tel_input_limpio VARCHAR(255);
                
                -- Limpiar el input de cualquier cosa que no sea n├║mero (por si acaso)
                SET v_tel_input_limpio = REGEXP_REPLACE(p_numero_telefono, '[^0-9]', '');
                
                -- 1. BUSCAR UNA COBRANZA INDIVIDUAL QUE COINCIDA EXACTAMENTE
                -- Comparamos los ├║ltimos 9 d├¡gitos para mayor seguridad y flexibilidad
                SELECT c.I006ID_COBRANZA INTO v_id_cobranza_exacta
                FROM tb006_cobranzas c
                INNER JOIN tb004_telefonos t ON c.I002ID_CLIENTE = t.I002ID_CLIENTE
                WHERE (REGEXP_REPLACE(t.V004NUMERO, '[^0-9]', '') LIKE CONCAT('%', v_tel_input_limpio)
                       OR v_tel_input_limpio LIKE CONCAT('%', REGEXP_REPLACE(t.V004NUMERO, '[^0-9]', '')))
                  AND t.E004ESTADO_TELEFONO = 'activo'
                  AND c.E006ESTADO_COBRANZA = 'activo'
                  AND ABS(c.D006MONTO_TOTAL - p_monto) < 0.01
                ORDER BY c.I006ID_COBRANZA ASC
                LIMIT 1;

                IF v_id_cobranza_exacta IS NOT NULL THEN
                    UPDATE tb006_cobranzas
                    SET E006ESTADO_COBRANZA = 'inactivo', 
                        F006FECHA_PAGO = NOW(), 
                        V006METODO_PAGO = p_metodo
                    WHERE I006ID_COBRANZA = v_id_cobranza_exacta;
                    
                    SELECT 'Pago INDIVIDUAL registrado correctamente.' AS mensaje, 200 AS codigo_error;

                ELSE
                    -- 2. BUSCAR SI EL MONTO ES LA SUMA TOTAL DEL GRUPO
                    SELECT SUM(c.D006MONTO_TOTAL) INTO v_suma_total_grupo
                    FROM tb006_cobranzas c
                    INNER JOIN tb004_telefonos t ON c.I002ID_CLIENTE = t.I002ID_CLIENTE
                    WHERE (REGEXP_REPLACE(t.V004NUMERO, '[^0-9]', '') LIKE CONCAT('%', v_tel_input_limpio)
                       OR v_tel_input_limpio LIKE CONCAT('%', REGEXP_REPLACE(t.V004NUMERO, '[^0-9]', '')))
                      AND t.E004ESTADO_TELEFONO = 'activo'
                      AND c.E006ESTADO_COBRANZA = 'activo';

                    IF v_suma_total_grupo > 0 AND ABS(v_suma_total_grupo - p_monto) < 0.01 THEN
                        -- CANCELAR TODAS LAS DEUDAS
                        UPDATE tb006_cobranzas c
                        INNER JOIN tb004_telefonos t ON c.I002ID_CLIENTE = t.I002ID_CLIENTE
                        SET c.E006ESTADO_COBRANZA = 'inactivo', 
                            c.F006FECHA_PAGO = NOW(), 
                            c.V006METODO_PAGO = p_metodo
                        WHERE (REGEXP_REPLACE(t.V004NUMERO, '[^0-9]', '') LIKE CONCAT('%', v_tel_input_limpio)
                           OR v_tel_input_limpio LIKE CONCAT('%', REGEXP_REPLACE(t.V004NUMERO, '[^0-9]', '')))
                          AND t.E004ESTADO_TELEFONO = 'activo'
                          AND c.E006ESTADO_COBRANZA = 'activo';
                        
                        SELECT 'Pago TOTAL validado. Se cancelaron todas las deudas del grupo.' AS mensaje, 200 AS codigo_error;
                    
                    ELSE
                        IF v_suma_total_grupo = 0 THEN
                            SELECT 'No hay deudas pendientes para este n├║mero.' AS mensaje, 200 AS codigo_error;
                        ELSE
                            SELECT CONCAT('Error: El monto (S/ ', p_monto, ') no coincide con ninguna deuda activa ni con el total (S/ ', v_suma_total_grupo, ').') AS mensaje, 400 AS codigo_error;
                        END IF;
                    END IF;
                END IF;
            END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-26 16:43:47
