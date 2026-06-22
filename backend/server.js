const express = require('express');
const mysql = require('mysql2');

const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'P0p5t4r',
    database: 'ControlEscolar_React'
});

db.connect(err => {
    if (err) {
        console.error('Error al conectar a MySQL:', err);
        return;
    }

    console.log('Conectado a MySQL');
});

app.get('/api/estados', (req, res) => {
    db.query(
        'SELECT * FROM CEstados ORDER BY Nombre',
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: err });
            }

            res.json(results);
        }
    );
});

app.post('/api/estados', (req, res) => {

    const { Nombre } = req.body;

    db.query(
        'INSERT INTO CEstados (Nombre) VALUES (?)',
        [Nombre],
        (err, results) => {

            if (err) {
                return res.status(500).json({ error: err });
            }

            res.json({
                mensaje: 'Estado registrado',
                id: results.insertId
            });
        }
    );
});

app.put('/api/estados/:id', (req, res) => {

    const { Nombre } = req.body;

    db.query(
        'UPDATE CEstados SET Nombre=? WHERE idEstado=?',
        [Nombre, req.params.id],
        (err) => {

            if (err) {
                return res.status(500).json({ error: err });
            }

            res.json({
                mensaje: 'Estado actualizado'
            });
        }
    );
});

app.delete('/api/estados/:id', (req, res) => {

    db.query(
        'DELETE FROM CEstados WHERE idEstado=?',
        [req.params.id],
        (err) => {

            if (err) {
                return res.status(500).json({ error: err });
            }

            res.json({
                mensaje: 'Estado eliminado'
            });
        }
    );
});

app.get('/api/municipios', (req, res) => {

    db.query(`
        SELECT
            m.idMunicipio,
            m.Nombre,
            m.idEstado,
            e.Nombre AS Estado
        FROM CMunicipio m
        INNER JOIN CEstados e
            ON m.idEstado = e.idEstado
        ORDER BY m.Nombre
    `,
    (err, results) => {

        if (err) {
            return res.status(500).json({ error: err });
        }

        res.json(results);
    });

});


app.post('/api/municipios', (req, res) => {

    const {
        Nombre,
        idEstado
    } = req.body;

    db.query(
        'INSERT INTO CMunicipio (Nombre,idEstado) VALUES (?,?)',
        [Nombre, idEstado],
        (err, results) => {

            if (err) {
                return res.status(500).json({ error: err });
            }

            res.json({
                mensaje: 'Municipio registrado',
                id: results.insertId
            });
        }
    );

});

app.put('/api/municipios/:id', (req, res) => {

    const {
        Nombre,
        idEstado
    } = req.body;

    db.query(
        'UPDATE CMunicipio SET Nombre=?, idEstado=? WHERE idMunicipio=?',
        [Nombre, idEstado, req.params.id],
        (err) => {

            if (err) {
                return res.status(500).json({ error: err });
            }

            res.json({
                mensaje: 'Municipio actualizado'
            });
        }
    );

});

app.delete('/api/municipios/:id', (req, res) => {

    db.query(
        'DELETE FROM CMunicipio WHERE idMunicipio=?',
        [req.params.id],
        (err) => {

            if (err) {
                return res.status(500).json({ error: err });
            }

            res.json({
                mensaje: 'Municipio eliminado'
            });
        }
    );

});


app.get('/api/localidades', (req, res) => {

    db.query(`
        SELECT
            l.idLocalidad,
            l.Nombre,
            l.idMunicipio,
            m.Nombre AS Municipio
        FROM CLocalidad l
        INNER JOIN CMunicipio m
            ON l.idMunicipio = m.idMunicipio
        ORDER BY l.Nombre
    `,
    (err, results) => {

        if (err) {
            return res.status(500).json({ error: err });
        }

        res.json(results);
    });

});


app.post('/api/localidades', (req, res) => {

    const {
        Nombre,
        idMunicipio
    } = req.body;

    db.query(
        'INSERT INTO CLocalidad (Nombre,idMunicipio) VALUES (?,?)',
        [Nombre, idMunicipio],
        (err, results) => {

            if (err) {
                return res.status(500).json({ error: err });
            }

            res.json({
                mensaje: 'Localidad registrada',
                id: results.insertId
            });
        }
    );

});


app.put('/api/localidades/:id', (req, res) => {

    const {
        Nombre,
        idMunicipio
    } = req.body;

    db.query(
        'UPDATE CLocalidad SET Nombre=?, idMunicipio=? WHERE idLocalidad=?',
        [Nombre, idMunicipio, req.params.id],
        (err) => {

            if (err) {
                return res.status(500).json({ error: err });
            }

            res.json({
                mensaje: 'Localidad actualizada'
            });
        }
    );

});

app.delete('/api/localidades/:id', (req, res) => {

    db.query(
        'DELETE FROM CLocalidad WHERE idLocalidad=?',
        [req.params.id],
        (err) => {

            if (err) {
                return res.status(500).json({ error: err });
            }

            res.json({
                mensaje: 'Localidad eliminada'
            });
        }
    );

});


app.get('/api/carreras', (req, res) => {

    db.query(`
        SELECT
            idCarrera,
            NombreCarreras,
            Estatus
        FROM CCarreras
        ORDER BY NombreCarreras
    `,
    (err, results) => {

        if (err) {
            return res.status(500).json({ error: err });
        }

        res.json(results);
    });

});

app.post('/api/carreras', (req, res) => {

    const { NombreCarreras } = req.body;

    db.query(
        `
        INSERT INTO CCarreras
        (NombreCarreras, Estatus)
        VALUES (?, 1)
        `,
        [NombreCarreras],
        (err, results) => {

            if (err) {
                return res.status(500).json({ error: err });
            }

            res.json({
                mensaje: 'Carrera registrada',
                id: results.insertId
            });
        }
    );

});

app.put('/api/carreras/:id', (req, res) => {

    const {
        NombreCarreras,
        Estatus
    } = req.body;

    db.query(
        `
        UPDATE CCarreras
        SET NombreCarreras = ?,
            Estatus = ?
        WHERE idCarrera = ?
        `,
        [
            NombreCarreras,
            Estatus,
            req.params.id
        ],
        (err) => {

            if (err) {
                return res.status(500).json({ error: err });
            }

            res.json({
                mensaje: 'Carrera actualizada'
            });
        }
    );

});

app.delete('/api/carreras/:id', (req, res) => {

    db.query(
        'DELETE FROM CCarreras WHERE idCarrera = ?',
        [req.params.id],
        (err) => {

            if (err) {
                return res.status(500).json({ error: err });
            }

            res.json({
                mensaje: 'Carrera eliminada'
            });
        }
    );

});


app.get('/api/generos', (req, res) => {

    db.query(
        'SELECT * FROM Genero ORDER BY Genero',
        (err, results) => {

            if (err) {
                return res.status(500).json({ error: err });
            }

            res.json(results);
        }
    );

});

app.post('/api/generos', (req, res) => {

    const { Genero } = req.body;

    db.query(
        `
        INSERT INTO Genero (Genero)
        VALUES (?)
        `,
        [Genero],
        (err, results) => {

            if (err) {
                return res.status(500).json({ error: err });
            }

            res.json({
                mensaje: 'Género registrado',
                id: results.insertId
            });
        }
    );

});

app.put('/api/generos/:id', (req, res) => {

    const { Genero } = req.body;

    db.query(
        `
        UPDATE Genero
        SET Genero = ?
        WHERE idGenero = ?
        `,
        [
            Genero,
            req.params.id
        ],
        (err) => {

            if (err) {
                return res.status(500).json({ error: err });
            }

            res.json({
                mensaje: 'Género actualizado'
            });
        }
    );

});

app.delete('/api/generos/:id', (req, res) => {

    db.query(
        'DELETE FROM Genero WHERE idGenero = ?',
        [req.params.id],
        (err) => {

            if (err) {
                return res.status(500).json({ error: err });
            }

            res.json({
                mensaje: 'Género eliminado'
            });
        }
    );

});

app.get('/api/tipospersonal', (req, res) => {

    db.query(
        `
        SELECT *
        FROM CTipoPersonal
        ORDER BY Personal
        `,
        (err, results) => {

            if (err) {
                return res.status(500).json({ error: err });
            }

            res.json(results);
        }
    );

});

app.post('/api/tipospersonal', (req, res) => {

    const { Personal } = req.body;

    db.query(
        `
        INSERT INTO CTipoPersonal (Personal)
        VALUES (?)
        `,
        [Personal],
        (err, results) => {

            if (err) {
                return res.status(500).json({ error: err });
            }

            res.json({
                mensaje: 'Tipo de personal registrado',
                id: results.insertId
            });
        }
    );

});

app.put('/api/tipospersonal/:id', (req, res) => {

    const { Personal } = req.body;

    db.query(
        `
        UPDATE CTipoPersonal
        SET Personal = ?
        WHERE idTipo = ?
        `,
        [
            Personal,
            req.params.id
        ],
        (err) => {

            if (err) {
                return res.status(500).json({ error: err });
            }

            res.json({
                mensaje: 'Tipo de personal actualizado'
            });
        }
    );

});

app.delete('/api/tipospersonal/:id', (req, res) => {

    db.query(
        `
        DELETE FROM CTipoPersonal
        WHERE idTipo = ?
        `,
        [req.params.id],
        (err) => {

            if (err) {
                return res.status(500).json({ error: err });
            }

            res.json({
                mensaje: 'Tipo de personal eliminado'
            });
        }
    );

});

app.get('/api/datosescuela', (req, res) => {

    db.query(`
        SELECT
            de.CCT,
            de.Nombre,
            de.Telefono,
            de.Email,
            de.Calle,
            de.NumE,
            de.NumI,
            de.CP,
            de.idEstado,
            e.Nombre AS Estado,
            de.idMunicipio,
            m.Nombre AS Municipio,
            de.idLocalidad,
            l.Nombre AS Localidad
        FROM CDatosEscuela de
        INNER JOIN CEstados e
            ON de.idEstado = e.idEstado
        INNER JOIN CMunicipio m
            ON de.idMunicipio = m.idMunicipio
        INNER JOIN CLocalidad l
            ON de.idLocalidad = l.idLocalidad
        ORDER BY de.Nombre
    `,
    (err, results) => {

        if (err) {
            return res.status(500).json({ error: err });
        }

        res.json(results);
    });

});


app.post('/api/datosescuela', (req, res) => {

    const {
        CCT,
        Nombre,
        Telefono,
        Email,
        Calle,
        NumE,
        NumI,
        CP,
        idEstado,
        idMunicipio,
        idLocalidad
    } = req.body;

    db.query(`
        INSERT INTO CDatosEscuela
        (
            CCT,
            Nombre,
            Telefono,
            Email,
            Calle,
            NumE,
            NumI,
            CP,
            idEstado,
            idMunicipio,
            idLocalidad
        )
        VALUES (?,?,?,?,?,?,?,?,?,?,?)
    `,
    [
        CCT,
        Nombre,
        Telefono,
        Email,
        Calle,
        NumE,
        NumI,
        CP,
        idEstado,
        idMunicipio,
        idLocalidad
    ],
    (err) => {

        if (err) {
            return res.status(500).json({ error: err });
        }

        res.json({
            mensaje: 'Escuela registrada'
        });
    });

});


app.put('/api/datosescuela/:id', (req, res) => {

    const {
        Nombre,
        Telefono,
        Email,
        Calle,
        NumE,
        NumI,
        CP,
        idEstado,
        idMunicipio,
        idLocalidad
    } = req.body;

    db.query(`
        UPDATE CDatosEscuela
        SET Nombre=?,
            Telefono=?,
            Email=?,
            Calle=?,
            NumE=?,
            NumI=?,
            CP=?,
            idEstado=?,
            idMunicipio=?,
            idLocalidad=?
        WHERE CCT=?
    `,
    [
        Nombre,
        Telefono,
        Email,
        Calle,
        NumE,
        NumI,
        CP,
        idEstado,
        idMunicipio,
        idLocalidad,
        req.params.id
    ],
    (err) => {

        if (err) {
            return res.status(500).json({ error: err });
        }

        res.json({
            mensaje: 'Escuela actualizada'
        });
    });

});


app.delete('/api/datosescuela/:id', (req, res) => {

    db.query(
        'DELETE FROM CDatosEscuela WHERE CCT=?',
        [req.params.id],
        (err) => {

            if (err) {
                return res.status(500).json({ error: err });
            }

            res.json({
                mensaje: 'Escuela eliminada'
            });
        }
    );

});

app.get('/api/datospersonales', (req, res) => {

    db.query(`
        SELECT
            dp.idDatosP,
            dp.Nombre,
            dp.FechaNacimiento,
            dp.Curp,
            dp.Email,
            dp.Telefono,
            dp.Calle,
            dp.NumE,
            dp.NumI,
            dp.CP,
            dp.idGenero,
            g.Genero,
            dp.idEstado,
            e.Nombre AS Estado,
            dp.idMunicipio,
            m.Nombre AS Municipio,
            dp.idLocalidad,
            l.Nombre AS Localidad
        FROM CDatosPersonales dp
        INNER JOIN Genero g
            ON dp.idGenero = g.idGenero
        INNER JOIN CEstados e
            ON dp.idEstado = e.idEstado
        INNER JOIN CMunicipio m
            ON dp.idMunicipio = m.idMunicipio
        INNER JOIN CLocalidad l
            ON dp.idLocalidad = l.idLocalidad
        ORDER BY dp.Nombre
    `,
    (err, results) => {

        if (err) {
            return res.status(500).json({ error: err });
        }

        res.json(results);
    });

});

app.post('/api/datospersonales', (req, res) => {

    const {
        Nombre,
        FechaNacimiento,
        Curp,
        Email,
        Telefono,
        Calle,
        NumE,
        NumI,
        CP,
        idGenero,
        idEstado,
        idMunicipio,
        idLocalidad
    } = req.body;

    db.query(`
        INSERT INTO CDatosPersonales
        (
            Nombre,
            FechaNacimiento,
            Curp,
            Email,
            Telefono,
            Calle,
            NumE,
            NumI,
            CP,
            idGenero,
            idEstado,
            idMunicipio,
            idLocalidad
        )
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `,
    [
        Nombre,
        FechaNacimiento,
        Curp,
        Email,
        Telefono,
        Calle,
        NumE,
        NumI,
        CP,
        idGenero,
        idEstado,
        idMunicipio,
        idLocalidad
    ],
    (err) => {

        if (err) {
            return res.status(500).json({ error: err });
        }

        res.json({
            mensaje: 'Datos personales registrados'
        });
    });

});


app.put('/api/datospersonales/:id', (req, res) => {

    const {
        Nombre,
        FechaNacimiento,
        Curp,
        Email,
        Telefono,
        Calle,
        NumE,
        NumI,
        CP,
        idGenero,
        idEstado,
        idMunicipio,
        idLocalidad
    } = req.body;

    db.query(`
        UPDATE CDatosPersonales
        SET Nombre=?,
            FechaNacimiento=?,
            Curp=?,
            Email=?,
            Telefono=?,
            Calle=?,
            NumE=?,
            NumI=?,
            CP=?,
            idGenero=?,
            idEstado=?,
            idMunicipio=?,
            idLocalidad=?
        WHERE idDatosP=?
    `,
    [
        Nombre,
        FechaNacimiento,
        Curp,
        Email,
        Telefono,
        Calle,
        NumE,
        NumI,
        CP,
        idGenero,
        idEstado,
        idMunicipio,
        idLocalidad,
        req.params.id
    ],
    (err) => {

        if (err) {
            return res.status(500).json({ error: err });
        }

        res.json({
            mensaje: 'Datos personales actualizados'
        });
    });

});


app.delete('/api/datospersonales/:id', (req, res) => {

    db.query(
        'DELETE FROM CDatosPersonales WHERE idDatosP=?',
        [req.params.id],
        (err) => {

            if (err) {
                return res.status(500).json({ error: err });
            }

            res.json({
                mensaje: 'Datos personales eliminados'
            });
        }
    );

});

app.get('/api/alumnos', (req, res) => {

    db.query(`
        SELECT
            a.Matricula,
            a.idCarrera,
            c.NombreCarreras,
            a.idDatosP,
            dp.Nombre,
            a.Status
        FROM CAlumnos a
        INNER JOIN CCarreras c
            ON a.idCarrera = c.idCarrera
        INNER JOIN CDatosPersonales dp
            ON a.idDatosP = dp.idDatosP
        ORDER BY a.Matricula
    `,
    (err, results) => {

        if (err) {
            return res.status(500).json({ error: err });
        }

        res.json(results);
    });

});


app.post('/api/alumnos', (req, res) => {

    const {
        Matricula,
        idCarrera,
        idDatosP
    } = req.body;

    db.query(`
        INSERT INTO CAlumnos
        (
            Matricula,
            idCarrera,
            idDatosP,
            Status
        )
        VALUES (?,?,?,'A')
    `,
    [
        Matricula,
        idCarrera,
        idDatosP
    ],
    (err) => {

        if (err) {
            return res.status(500).json({ error: err });
        }

        res.json({
            mensaje: 'Alumno registrado'
        });
    });

});


app.put('/api/alumnos/:id', (req, res) => {

    const {
        idCarrera,
        idDatosP,
        Status
    } = req.body;

    db.query(`
        UPDATE CAlumnos
        SET idCarrera=?,
            idDatosP=?,
            Status=?
        WHERE Matricula=?
    `,
    [
        idCarrera,
        idDatosP,
        Status,
        req.params.id
    ],
    (err) => {

        if (err) {
            return res.status(500).json({ error: err });
        }

        res.json({
            mensaje: 'Alumno actualizado'
        });
    });

});


app.delete('/api/alumnos/:id', (req, res) => {

    db.query(
        'DELETE FROM CAlumnos WHERE Matricula=?',
        [req.params.id],
        (err) => {

            if (err) {
                return res.status(500).json({ error: err });
            }

            res.json({
                mensaje: 'Alumno eliminado'
            });
        }
    );

});

app.get('/api/personal', (req, res) => {

    db.query(`
        SELECT
            p.idPersonal,
            p.ClaveEmp,
            p.idDatosP,
            dp.Nombre,
            p.idTipo,
            tp.Personal,
            p.Status
        FROM CPersonal p
        INNER JOIN CDatosPersonales dp
            ON p.idDatosP = dp.idDatosP
        INNER JOIN CTipoPersonal tp
            ON p.idTipo = tp.idTipo
        ORDER BY p.idPersonal
    `,
    (err, results) => {

        if (err) {
            return res.status(500).json({ error: err });
        }

        res.json(results);
    });

});


app.post('/api/personal', (req, res) => {

    const {
        idDatosP,
        idTipo,
        ClaveEmp
    } = req.body;

    db.query(`
        INSERT INTO CPersonal
        (
            idDatosP,
            idTipo,
            ClaveEmp,
            Status
        )
        VALUES (?,?,?,1)
    `,
    [
        idDatosP,
        idTipo,
        ClaveEmp
    ],
    (err, results) => {

        if (err) {
            return res.status(500).json({ error: err });
        }

        res.json({
            mensaje: 'Personal registrado',
            id: results.insertId
        });
    });

});

app.put('/api/personal/:id', (req, res) => {

    const {
        idDatosP,
        idTipo,
        ClaveEmp,
        Status
    } = req.body;

    db.query(`
        UPDATE CPersonal
        SET idDatosP=?,
            idTipo=?,
            ClaveEmp=?,
            Status=?
        WHERE idPersonal=?
    `,
    [
        idDatosP,
        idTipo,
        ClaveEmp,
        Status,
        req.params.id
    ],
    (err) => {

        if (err) {
            return res.status(500).json({ error: err });
        }

        res.json({
            mensaje: 'Personal actualizado'
        });
    });

});


app.delete('/api/personal/:id', (req, res) => {

    db.query(
        'DELETE FROM CPersonal WHERE idPersonal=?',
        [req.params.id],
        (err) => {

            if (err) {
                return res.status(500).json({ error: err });
            }

            res.json({
                mensaje: 'Personal eliminado'
            });
        }
    );

});


app.listen(5000, () => {
    console.log('Servidor ejecutándose en http://localhost:5000');
});