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

--
-- Struktur dari tabel `meta`
--

CREATE TABLE IF NOT EXISTS `meta` (
  `meta_id` smallint(5) NOT NULL DEFAULT '0',
  `meta_name` varchar(64) NOT NULL,
  `meta_content` text NOT NULL,
  `meta_file` varchar(255) NOT NULL,
  PRIMARY KEY (`meta_id`),
  UNIQUE KEY `judul` (`meta_name`),
  KEY `file` (`meta_file`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Struktur dari tabel `sessions`
--

CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` varchar(32) NOT NULL,
  `session_data` text NOT NULL,
  `session_domain` varchar(255) NOT NULL,
  `session_ip` char(32) NOT NULL,
  `session_expiration` int(11) NOT NULL,
  `anggota_id` smallint(5) NOT NULL,
  PRIMARY KEY (`session_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
