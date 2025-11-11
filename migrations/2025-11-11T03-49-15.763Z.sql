CREATE TABLE users (
    id SERIAL PRIMARY KEY,  
    email TEXT NOT NULL UNIQUE, 
    password TEXT,
    email_verified BOOLEAN NOT NULL DEFAULT false, 
    role VARCHAR(20),
    image TEXT, 
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL, 
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);


CREATE TABLE siswa (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    nama_lengkap VARCHAR(255) NOT NULL,
    nisn VARCHAR(50) UNIQUE NOT NULL,
    tempat_lahir VARCHAR(100),
    tanggal_lahir DATE,
    alamat TEXT,
    no_telepon VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
)


CREATE TABLE guru (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    nama_lengkap VARCHAR(255) NOT NULL,
    nip VARCHAR(50) UNIQUE NOT NULL,
    tempat_lahir VARCHAR(100),
    tanggal_lahir DATE,
    alamat TEXT,
    no_telepon VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);


CREATE TABLE wali_siswa (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    nama_lengkap VARCHAR(255) NOT NULL,
    hubungan VARCHAR(50),
    no_telepon VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE TABLE kelas (
    kode VARCHAR(10) PRIMARY KEY,
    wali_kelas_id INTEGER REFERENCES guru(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE mata_pelajaran (
    kode_mapel VARCHAR(10) PRIMARY KEY,
    nama_mapel VARCHAR(100) NOT NULL,
    deskripsi TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Tabel relasi: Guru mengajar Mata Pelajaran di Kelas tertentu
CREATE TABLE pengajaran (
    id SERIAL PRIMARY KEY,
    guru_id INTEGER REFERENCES guru(id) ON DELETE CASCADE NOT NULL,
    kelas_kode VARCHAR(10) REFERENCES kelas(kode) ON DELETE CASCADE NOT NULL,
    kode_mapel VARCHAR(10) REFERENCES mata_pelajaran(kode_mapel) ON DELETE CASCADE NOT NULL,
    tahun_ajaran VARCHAR(20) NOT NULL, -- Contoh: "2024/2025"
    semester SMALLINT CHECK (semester IN (1, 2)) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE(guru_id, kelas_kode, kode_mapel, tahun_ajaran, semester)
);

-- Tabel relasi: Siswa terdaftar di Kelas
CREATE TABLE kelas_siswa (
    id SERIAL PRIMARY KEY,
    kelas_kode VARCHAR(10) REFERENCES kelas(kode) ON DELETE CASCADE NOT NULL,
    siswa_id INTEGER REFERENCES siswa(id) ON DELETE CASCADE NOT NULL,
    tahun_ajaran VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE(kelas_kode, siswa_id, tahun_ajaran)
);

-- Tabel Tugas
CREATE TABLE tugas (
    id SERIAL PRIMARY KEY,
    pengajaran_id INTEGER REFERENCES pengajaran(id) ON DELETE CASCADE NOT NULL,
    judul VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    tanggal_deadline TIMESTAMPTZ NOT NULL,
    file_url TEXT, -- Link ke file tugas (opsional)
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Tabel Pengumpulan Tugas oleh Siswa
CREATE TABLE pengumpulan_tugas (
    id SERIAL PRIMARY KEY,
    tugas_id INTEGER REFERENCES tugas(id) ON DELETE CASCADE NOT NULL,
    siswa_id INTEGER REFERENCES siswa(id) ON DELETE CASCADE NOT NULL,
    file_url TEXT, -- Link ke file yang dikumpulkan
    catatan TEXT,
    tanggal_pengumpulan TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    nilai DECIMAL(5,2) CHECK (nilai >= 0 AND nilai <= 100),
    feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE(tugas_id, siswa_id)
);

-- Tabel Kehadiran
CREATE TABLE kehadiran (
    id SERIAL PRIMARY KEY,
    pengajaran_id INTEGER REFERENCES pengajaran(id) ON DELETE CASCADE NOT NULL,
    siswa_id INTEGER REFERENCES siswa(id) ON DELETE CASCADE NOT NULL,
    tanggal DATE NOT NULL,
    status VARCHAR(10) CHECK (status IN ('HADIR', 'IZIN', 'SAKIT', 'ALPHA')) NOT NULL,
    keterangan TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE(pengajaran_id, siswa_id, tanggal)
);

-- Index untuk performa query
CREATE INDEX idx_pengajaran_guru ON pengajaran(guru_id);
CREATE INDEX idx_pengajaran_kelas ON pengajaran(kelas_kode);
CREATE INDEX idx_pengajaran_mapel ON pengajaran(kode_mapel);
CREATE INDEX idx_kelas_siswa_kelas ON kelas_siswa(kelas_kode);
CREATE INDEX idx_kelas_siswa_siswa ON kelas_siswa(siswa_id);
CREATE INDEX idx_tugas_pengajaran ON tugas(pengajaran_id);
CREATE INDEX idx_pengumpulan_tugas_siswa ON pengumpulan_tugas(siswa_id);
CREATE INDEX idx_kehadiran_pengajaran ON kehadiran(pengajaran_id);
CREATE INDEX idx_kehadiran_siswa ON kehadiran(siswa_id);
CREATE INDEX idx_kehadiran_tanggal ON kehadiran(tanggal);