CREATE TABLE IF NOT EXISTS `anggota_level` (
  `anggota_level_id` tinyint(1) unsigned NOT NULL AUTO_INCREMENT,
  `anggota_level_upline_id` tinyint(1) NOT NULL,
  `anggota_level_alias` varchar(32) NOT NULL DEFAULT 'anggota' COMMENT 'default pendaftaran : anggota',
  `anggota_level_nama` varchar(25) NOT NULL,
  `anggota_level_simbol` varchar(8) NOT NULL,
  `anggota_level_keterangan` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`anggota_level_id`),
  UNIQUE KEY `alias` (`anggota_level_alias`),
  KEY `deskripsi` (`anggota_level_keterangan`),
  KEY `upline` (`anggota_level_upline_id`),
  KEY `nama` (`anggota_level_nama`),
  KEY `simbol` (`anggota_level_simbol`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 COMMENT='Kriteria anggota dalam mengakses sistem' AUTO_INCREMENT=9 ;

--
-- Dumping data untuk tabel `anggota_level`
--

INSERT INTO `anggota_level` (`anggota_level_id`, `anggota_level_upline_id`, `anggota_level_alias`, `anggota_level_nama`, `anggota_level_simbol`, `anggota_level_keterangan`) VALUES
(1, 0, 'administrator', 'Administrator', '@', 'Pemilik usaha'),
(2, 1, 'administrasi', 'Administrasi', '$', 'Pelaksana usaha yang terdiri dari menejer dan karyawan lapangan. '),
(3, 1, 'keuangan', 'Keuangan', '', 'Konsumen sebagai pengguna usaha'),
(6, 0, 'agen/administrator', 'Administrator', '', NULL),
(7, 6, 'agen/administrasi', 'Administrasi', '', NULL),
(8, 6, 'agen/keuangan', 'Keuangan', '', NULL);
