-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: conexa
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `avaliacao`
--

DROP TABLE IF EXISTS `avaliacao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `avaliacao` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `evento_id` int NOT NULL,
  `nota` int DEFAULT NULL,
  `comentario` text,
  `criado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `evento_id` (`evento_id`),
  CONSTRAINT `avaliacao_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE,
  CONSTRAINT `avaliacao_ibfk_2` FOREIGN KEY (`evento_id`) REFERENCES `eventos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `avaliacao_chk_1` CHECK ((`nota` between 1 and 10))
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `avaliacao`
--

LOCK TABLES `avaliacao` WRITE;
/*!40000 ALTER TABLE `avaliacao` DISABLE KEYS */;
/*!40000 ALTER TABLE `avaliacao` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `atualiza_media_avaliacao` AFTER INSERT ON `avaliacao` FOR EACH ROW BEGIN
  DECLARE media DECIMAL(3,2);

  -- Calcula a nova média de avaliações para o evento relacionado
  SELECT AVG(nota) INTO media FROM avaliacao WHERE evento_id = NEW.evento_id;

  -- Atualiza a média na tabela de eventos
  UPDATE eventos SET avaliacao_media = media WHERE id = NEW.evento_id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `atualiza_media_avaliacao_update` AFTER UPDATE ON `avaliacao` FOR EACH ROW BEGIN
  DECLARE media DECIMAL(3,2);

  -- Recalcula a média após a atualização
  SELECT AVG(nota) INTO media FROM avaliacao WHERE evento_id = NEW.evento_id;

  -- Atualiza o campo na tabela de eventos
  UPDATE eventos SET avaliacao_media = media WHERE id = NEW.evento_id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `atualiza_media_avaliacao_delete` AFTER DELETE ON `avaliacao` FOR EACH ROW BEGIN
  DECLARE media DECIMAL(3,2);

  -- Recalcula a média após a exclusão
  SELECT AVG(nota) INTO media FROM avaliacao WHERE evento_id = OLD.evento_id;

  -- Atualiza o campo na tabela de eventos (se não houver mais avaliações, zera)
  UPDATE eventos SET avaliacao_media = IFNULL(media, 0) WHERE id = OLD.evento_id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `categoria`
--

DROP TABLE IF EXISTS `categoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categoria` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `descricao` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoria`
--

LOCK TABLES `categoria` WRITE;
/*!40000 ALTER TABLE `categoria` DISABLE KEYS */;
INSERT INTO `categoria` VALUES (1,'Tecnologia','Eventos sobre inovações e tecnologia'),(2,'Arte','Eventos artísticos e culturais'),(3,'Música','Shows e festivais musicais'),(4,'Educação','Palestras, workshops e cursos'),(5,'Saúde','Feiras e campanhas de bem-estar'),(6,'Esportes','Competições e eventos esportivos'),(7,'Negócios','Conferências e networking'),(8,'Gastronomia','Feiras e eventos culinários'),(9,'Meio Ambiente','Eventos sustentáveis e ecológicos'),(10,'Entretenimento','Lazer, humor e cultura pop'),(11,'Família','Eventos voltados para todas as idades'),(12,'Moda','Desfiles e tendências'),(13,'Cinema','Exibições e mostras'),(14,'Religião','Eventos espirituais e religiosos'),(15,'Voluntariado','Atividades de impacto social');
/*!40000 ALTER TABLE `categoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `endereco`
--

DROP TABLE IF EXISTS `endereco`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `endereco` (
  `id` int NOT NULL AUTO_INCREMENT,
  `logradouro` varchar(255) NOT NULL,
  `numero` varchar(20) NOT NULL,
  `bairro` varchar(100) NOT NULL,
  `cep` varchar(20) NOT NULL,
  `cidade` varchar(255) DEFAULT NULL,
  `UF` varchar(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `endereco`
--

LOCK TABLES `endereco` WRITE;
/*!40000 ALTER TABLE `endereco` DISABLE KEYS */;
INSERT INTO `endereco` VALUES (1,'Avenida Paulista','1578','Bela Vista','01310-200',NULL,NULL),(2,'Rua das Flores','123','Centro','80000-000',NULL,NULL),(3,'Praça da Liberdade','45','Liberdade','01503-010',NULL,NULL),(4,'Rua do Comércio','789','Comercial','04567-890',NULL,NULL),(5,'Estrada Velha','321','Vila Nova','09876-543',NULL,NULL),(6,'Rua Macapá','1263','Tingui','82620110',NULL,NULL),(18,'Rua Macapá','1212','Tingui','82620110','Curitiba','PR'),(19,'Rua Macapá','2121','Tingui','82620110','Curitiba','PR');
/*!40000 ALTER TABLE `endereco` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `eventos`
--

DROP TABLE IF EXISTS `eventos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `eventos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `descricao` text NOT NULL,
  `descricao_completa` text,
  `data` date NOT NULL,
  `hora` time NOT NULL,
  `imagem_evento` longblob,
  `avaliacao_media` decimal(3,2) DEFAULT '0.00',
  `criado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `criado_por` int DEFAULT NULL,
  `endereco_id` int DEFAULT NULL,
  `categoria` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `criado_por` (`criado_por`),
  KEY `endereco_id` (`endereco_id`),
  CONSTRAINT `eventos_ibfk_2` FOREIGN KEY (`criado_por`) REFERENCES `usuario` (`id`) ON DELETE SET NULL,
  CONSTRAINT `eventos_ibfk_3` FOREIGN KEY (`endereco_id`) REFERENCES `endereco` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `eventos`
--

LOCK TABLES `eventos` WRITE;
/*!40000 ALTER TABLE `eventos` DISABLE KEYS */;
INSERT INTO `eventos` VALUES (21,'Maratona Sustentável','Corrida com foco em sustentabilidade','Corrida de rua com pontos de coleta seletiva e doações para ONGs ambientais.','2024-09-10','07:00:00',NULL,0.00,'2025-04-14 22:34:42',1,1,NULL),(22,'Feira de Tecnologia','Inovações em tecnologia','Exposição de startups e grandes empresas de tecnologia mostrando tendências futuras.','2024-10-15','09:00:00',NULL,0.00,'2025-04-14 22:34:42',2,2,NULL),(23,'Festival Gastronômico','Gastronomia internacional','Chefs renomados apresentarão pratos típicos de diversos países.','2024-11-05','12:00:00',NULL,0.00,'2025-04-14 22:34:42',3,3,NULL),(24,'Workshop de Fotografia','Fotografia para iniciantes','Aprenda técnicas básicas e avançadas de fotografia com profissionais da área.','2024-08-20','14:00:00',NULL,0.00,'2025-04-14 22:34:42',1,4,NULL),(25,'Noite de Astronomia','Observação de estrelas','Observação de planetas e constelações com telescópios profissionais.','2024-07-22','20:00:00',NULL,0.00,'2025-04-14 22:34:42',2,5,NULL),(26,'jjjjj','evento teste',NULL,'2025-04-02','18:24:00',NULL,0.00,'2025-04-17 20:29:19',NULL,6,NULL),(27,'asdas','Tecnologia','1212','1212-12-12','12:21:00',NULL,0.00,'2025-04-17 22:14:38',16,18,''),(28,'a','Arte','sas','1212-12-12','12:21:00',NULL,0.00,'2025-04-17 22:32:36',16,19,'');
/*!40000 ALTER TABLE `eventos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inscricao`
--

DROP TABLE IF EXISTS `inscricao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inscricao` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `evento_id` int NOT NULL,
  `criado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `evento_id` (`evento_id`),
  CONSTRAINT `inscricao_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE,
  CONSTRAINT `inscricao_ibfk_2` FOREIGN KEY (`evento_id`) REFERENCES `eventos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inscricao`
--

LOCK TABLES `inscricao` WRITE;
/*!40000 ALTER TABLE `inscricao` DISABLE KEYS */;
/*!40000 ALTER TABLE `inscricao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `tipo` enum('usuario','admin') NOT NULL DEFAULT 'usuario',
  `imagem_perfil` longblob,
  `criado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'João Silva','joao@gmail.com','123456','(11) 99999-0001','usuario',NULL,'2025-04-08 21:14:02'),(2,'Maria Oliveira','maria@gmail.com','123456','(11) 99999-0002','admin',NULL,'2025-04-08 21:14:02'),(3,'Carlos Souza','carlos@gmail.com','123456','(11) 99999-0003','usuario',NULL,'2025-04-08 21:14:02'),(4,'Ana Lima','ana@gmail.com','123456','(11) 99999-0004','usuario',NULL,'2025-04-08 21:14:02'),(5,'Bruno Rocha','bruno@gmail.com','123456','(11) 99999-0005','usuario',NULL,'2025-04-08 21:14:02'),(6,'Fernanda Reis','fernanda@gmail.com','123456','(11) 99999-0006','admin',NULL,'2025-04-08 21:14:02'),(7,'Lucas Costa','lucas@gmail.com','123456','(11) 99999-0007','usuario',NULL,'2025-04-08 21:14:02'),(8,'Paula Mendes','paula@gmail.com','123456','(11) 99999-0008','usuario',NULL,'2025-04-08 21:14:02'),(9,'Ricardo Alves','ricardo@gmail.com','123456','(11) 99999-0009','usuario',NULL,'2025-04-08 21:14:02'),(10,'Juliana Martins','juliana@gmail.com','123456','(11) 99999-0010','usuario',NULL,'2025-04-08 21:14:02'),(11,'Gabriel Teixeira','gabriel@gmail.com','123456','(11) 99999-0011','usuario',NULL,'2025-04-08 21:14:02'),(12,'Patrícia Dias','patricia@gmail.com','123456','(11) 99999-0012','usuario',NULL,'2025-04-08 21:14:02'),(13,'André Cardoso','andre@gmail.com','123456','(11) 99999-0013','usuario',NULL,'2025-04-08 21:14:02'),(14,'Luciana Faria','luciana@gmail.com','123456','(11) 99999-0014','usuario',NULL,'2025-04-08 21:14:02'),(15,'Marcos Pereira','marcos@gmail.com','123456','(11) 99999-0015','usuario',NULL,'2025-04-08 21:14:02'),(16,'Joao','Joao@Joao','1234','92929292929','usuario','','2025-04-15 18:40:35'),(17,'alksdnaks','joao@Joao1.com','123213kldfnl@S','(13) 42353-2342','usuario',NULL,'2025-04-15 18:45:22'),(36,'alsdmnaslkn','ojjoasjd@oiasd.com','cakjfsd34fsdS','(43) 24536-7867','usuario','','2025-04-15 19:13:01'),(39,'asdaslkasjd','alsdkl@alksd.com','aksdlka@lamnldSS3','(30) 24034-9504','usuario','','2025-04-15 20:03:22'),(40,'asdsa','asd@asd.com','alsndkK7 ','(03) 49508-5934','usuario','','2025-04-15 20:03:58');
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'conexa'
--

--
-- Dumping routines for database 'conexa'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-17 19:42:36
