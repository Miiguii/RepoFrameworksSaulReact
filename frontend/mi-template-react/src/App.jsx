import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {

  const API = 'http://localhost:5000/api';

  const [modulo, setModulo] = useState('estados');
  const [form, setForm] = useState({});
  const [editId, setEditId] = useState(null);

  const [datos, setDatos] = useState({
    estados: [],
    municipios: [],
    localidades: [],
    carreras: [],
    generos: [],
    tiposPersonal: [],
    datosEscuela: [],
    datosPersonales: [],
    alumnos: [],
    personal: []
  });

  const apartados = {
    estados: 'Estados',
    municipios: 'Municipios',
    localidades: 'Localidades',
    carreras: 'Carreras',
    generos: 'Géneros',
    tipospersonal: 'Tipos de Personal',
    datosescuela: 'Datos Escuela',
    datospersonales: 'Datos Personales',
    alumnos: 'Alumnos',
    personal: 'Personal'
  };

  const idKeysMap = {
    estados: 'idEstado',
    municipios: 'idMunicipio',
    localidades: 'idLocalidad',
    carreras: 'idCarrera',
    generos: 'idGenero',
    tipospersonal: 'idTipo',
    datosescuela: 'CCT',
    datospersonales: 'idDatosP',
    alumnos: 'Matricula',
    personal: 'idPersonal'
  };

  const cargarTodo = async () => {
    try {
      const [
        est, mun, loc, car, gen, tp, esc, dp, alu, per
      ] = await Promise.all([
        axios.get(`${API}/estados`),
        axios.get(`${API}/municipios`),
        axios.get(`${API}/localidades`),
        axios.get(`${API}/carreras`),
        axios.get(`${API}/generos`),
        axios.get(`${API}/tipospersonal`),
        axios.get(`${API}/datosescuela`),
        axios.get(`${API}/datospersonales`),
        axios.get(`${API}/alumnos`),
        axios.get(`${API}/personal`)
      ]);

      setDatos({
        estados: est.data,
        municipios: mun.data,
        localidades: loc.data,
        carreras: car.data,
        generos: gen.data,
        tiposPersonal: tp.data,
        datosEscuela: esc.data,
        datosPersonales: dp.data,
        alumnos: alu.data,
        personal: per.data
      });

    } catch (error) {
      console.error(error);
      alert('Error al cargar datos');
    }
  };

  useEffect(() => {
    cargarTodo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let nuevoForm = { ...form, [name]: value };

    if (modulo === 'datosescuela' || modulo === 'datospersonales') {
      if (name === 'idEstado') {
        nuevoForm.idMunicipio = '';
        nuevoForm.idLocalidad = '';
      }
      if (name === 'idMunicipio') {
        nuevoForm.idLocalidad = '';
      }
    }
    setForm(nuevoForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const datosEnviar = { ...form };

      Object.keys(datosEnviar).forEach(key => {
        if (
          datosEnviar[key] === '' ||
          datosEnviar[key] === null ||
          datosEnviar[key] === undefined
        ) {
          delete datosEnviar[key];
        }
      });

      const url = `${API}/${modulo}`;

      if (editId) {
        await axios.put(`${url}/${editId}`, datosEnviar);
      } else {
        await axios.post(url, datosEnviar);
      }

      alert('Registro guardado');
      setForm({});
      setEditId(null);
      cargarTodo();

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error?.sqlMessage || error.message);
    }
  };

  const editar = (fila) => {
    setEditId(fila[idKeysMap[modulo]]);
    setForm({ ...fila });
  };

  const eliminar = async (id) => {
    if (!window.confirm('¿Eliminar este registro?')) return;
    try {
      await axios.delete(`${API}/${modulo}/${id}`);
      cargarTodo();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error?.sqlMessage || error.message);
    }
  };

  const getDatosActuales = () => {
    const mapa = {
      estados: datos.estados,
      municipios: datos.municipios,
      localidades: datos.localidades,
      carreras: datos.carreras,
      generos: datos.generos,
      tipospersonal: datos.tiposPersonal,
      datosescuela: datos.datosEscuela,
      datospersonales: datos.datosPersonales,
      alumnos: datos.alumnos,
      personal: datos.personal
    };
    return mapa[modulo] || [];
  };

  const datosTabla = getDatosActuales();

  const municipiosFiltrados = datos.municipios.filter(
    m => String(m.idEstado) === String(form.idEstado)
  );

  const localidadesFiltradas = datos.localidades.filter(
    l => String(l.idMunicipio) === String(form.idMunicipio)
  );

  return (
    <>
      <style>{`
        .app-layout {
          display: flex;
          min-height: 100vh;
          background-color: #f8fafc;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          flex-direction: row;
        }
        .sidebar {
          width: 260px;
          background-color: #0f172a;
          padding: 20px;
          flex-shrink: 0;
          box-sizing: border-box;
        }
        .sidebar-title {
          color: #fff;
          border-bottom: 1px solid #334155;
          padding-bottom: 15px;
          margin-bottom: 20px;
        }
        .menu-container {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .menu-btn {
          display: block;
          width: 100%;
          text-align: left;
          padding: 10px 15px;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }
        .main-content {
          flex: 1;
          padding: 20px;
          width: 100%;
          box-sizing: border-box;
          overflow-x: hidden;
        }
        .card {
          background: #fff;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          width: 100%;
          box-sizing: border-box;
          min-height: calc(100vh - 40px);
        }
        .table-responsive {
          overflow-x: auto;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }
        
        /* MEDIA QUERIES PARA PANTALLAS PEQUEÑAS (MÓVILES) */
        @media (max-width: 768px) {
          .app-layout {
            flex-direction: column;
          }
          .sidebar {
            width: 100%;
            padding: 15px;
          }
          .menu-container {
            flex-direction: row;
            overflow-x: auto;
            padding-bottom: 10px;
            /* Ocultar scrollbar en navegadores Webkit (Chrome/Safari) */
            scrollbar-width: none; 
          }
          .menu-container::-webkit-scrollbar {
            display: none;
          }
          .menu-btn {
            white-space: nowrap;
            width: auto;
          }
          .main-content {
            padding: 10px;
          }
          .card {
            padding: 15px;
            min-height: auto;
          }
        }
      `}</style>

      <div className="app-layout">
        
        <aside className="sidebar">
          <h3 className="sidebar-title">Control Escolar</h3>
          <div className="menu-container">
            {Object.entries(apartados).map(([key, nombre]) => (
              <button
                key={key}
                onClick={() => {
                  setModulo(key);
                  setForm({});
                  setEditId(null);
                }}
                className="menu-btn"
                style={{
                  background: modulo === key ? '#3b82f6' : 'transparent',
                  color: modulo === key ? '#fff' : '#94a3b8',
                  fontWeight: modulo === key ? 'bold' : 'normal',
                }}
              >
                {nombre}
              </button>
            ))}
          </div>
        </aside>

        <main className="main-content">
          <div className="card">
            <h2 style={{ color: '#334155', marginTop: 0, borderBottom: '2px solid #f1f5f9', paddingBottom: '15px' }}>
              {apartados[modulo]}
            </h2>


            {modulo === 'estados' && (
              <form onSubmit={handleSubmit} style={formStyleExt}>
                <input name="Nombre" value={form.Nombre || ''} onChange={handleChange} placeholder="Nombre del estado" style={inputStyleExt} required />
                <button type="submit" style={btnSubmitStyleExt(editId)}>{editId ? 'Actualizar' : 'Guardar'}</button>
              </form>
            )}


            {modulo === 'municipios' && (
              <form onSubmit={handleSubmit} style={formStyleExt}>
                <input name="Nombre" value={form.Nombre || ''} onChange={handleChange} placeholder="Nombre del municipio" style={inputStyleExt} required />
                <select name="idEstado" value={form.idEstado || ''} onChange={handleChange} style={inputStyleExt} required>
                  <option value="">Selecciona un estado</option>
                  {datos.estados.map(estado => (
                    <option key={estado.idEstado} value={estado.idEstado}>{estado.Nombre}</option>
                  ))}
                </select>
                <button type="submit" style={btnSubmitStyleExt(editId)}>{editId ? 'Actualizar' : 'Guardar'}</button>
              </form>
            )}

            {modulo === 'localidades' && (
              <form onSubmit={handleSubmit} style={formStyleExt}>
                <input name="Nombre" value={form.Nombre || ''} onChange={handleChange} placeholder="Nombre de la localidad" style={inputStyleExt} required />
                <select name="idMunicipio" value={form.idMunicipio || ''} onChange={handleChange} style={inputStyleExt} required>
                  <option value="">Selecciona un municipio</option>
                  {datos.municipios.map(municipio => (
                    <option key={municipio.idMunicipio} value={municipio.idMunicipio}>{municipio.Nombre}</option>
                  ))}
                </select>
                <button type="submit" style={btnSubmitStyleExt(editId)}>{editId ? 'Actualizar' : 'Guardar'}</button>
              </form>
            )}


            {modulo === 'carreras' && (
              <form onSubmit={handleSubmit} style={formStyleExt}>
                <input name="NombreCarreras" value={form.NombreCarreras || ''} onChange={handleChange} placeholder="Nombre de la carrera" style={inputStyleExt} required />
                {editId && (
                  <select name="Estatus" value={form.Estatus === undefined ? 1 : form.Estatus} onChange={handleChange} style={inputStyleExt}>
                    <option value={1}>Activa</option>
                    <option value={0}>Inactiva</option>
                  </select>
                )}
                <button type="submit" style={btnSubmitStyleExt(editId)}>{editId ? 'Actualizar' : 'Guardar'}</button>
              </form>
            )}

            {modulo === 'generos' && (
              <form onSubmit={handleSubmit} style={formStyleExt}>
                <input name="Genero" value={form.Genero || ''} onChange={handleChange} placeholder="Género" style={inputStyleExt} required />
                <button type="submit" style={btnSubmitStyleExt(editId)}>{editId ? 'Actualizar' : 'Guardar'}</button>
              </form>
            )}


            {modulo === 'tipospersonal' && (
              <form onSubmit={handleSubmit} style={formStyleExt}>
                <input name="Personal" value={form.Personal || ''} onChange={handleChange} placeholder="Tipo de personal" style={inputStyleExt} required />
                <button type="submit" style={btnSubmitStyleExt(editId)}>{editId ? 'Actualizar' : 'Guardar'}</button>
              </form>
            )}


            {modulo === 'datosescuela' && (
              <form onSubmit={handleSubmit} style={formStyleExt}>
                <input name="CCT" value={form.CCT || ''} onChange={handleChange} placeholder="CCT" style={inputStyleExt} required disabled={!!editId} />
                <input name="Nombre" value={form.Nombre || ''} onChange={handleChange} placeholder="Nombre" style={inputStyleExt} required />
                <input name="Telefono" value={form.Telefono || ''} onChange={handleChange} placeholder="Teléfono" style={inputStyleExt} />
                <input name="Email" type="email" value={form.Email || ''} onChange={handleChange} placeholder="Correo" style={inputStyleExt} />
                <input name="Calle" value={form.Calle || ''} onChange={handleChange} placeholder="Calle" style={inputStyleExt} />
                <input name="NumE" value={form.NumE || ''} onChange={handleChange} placeholder="Número Exterior" style={inputStyleExt} />
                <input name="NumI" value={form.NumI || ''} onChange={handleChange} placeholder="Número Interior" style={inputStyleExt} />
                <input name="CP" value={form.CP || ''} onChange={handleChange} placeholder="Código Postal" style={inputStyleExt} />
                
                <select name="idEstado" value={form.idEstado || ''} onChange={handleChange} style={inputStyleExt} required>
                  <option value="">Estado</option>
                  {datos.estados.map(estado => (
                    <option key={estado.idEstado} value={estado.idEstado}>{estado.Nombre}</option>
                  ))}
                </select>
                <select name="idMunicipio" value={form.idMunicipio || ''} onChange={handleChange} style={inputStyleExt} required>
                  <option value="">Municipio</option>
                  {municipiosFiltrados.map(municipio => (
                    <option key={municipio.idMunicipio} value={municipio.idMunicipio}>{municipio.Nombre}</option>
                  ))}
                </select>
                <select name="idLocalidad" value={form.idLocalidad || ''} onChange={handleChange} style={inputStyleExt} required>
                  <option value="">Localidad</option>
                  {localidadesFiltradas.map(localidad => (
                    <option key={localidad.idLocalidad} value={localidad.idLocalidad}>{localidad.Nombre}</option>
                  ))}
                </select>

                <div style={{ width: '100%', textAlign: 'right' }}>
                  <button type="submit" style={btnSubmitStyleExt(editId)}>{editId ? 'Actualizar' : 'Guardar'}</button>
                </div>
              </form>
            )}


            {modulo === 'datospersonales' && (
              <form onSubmit={handleSubmit} style={formStyleExt}>
                <input name="Nombre" value={form.Nombre || ''} onChange={handleChange} placeholder="Nombre completo" style={inputStyleExt} required />
                <input name="FechaNacimiento" type="date" value={form.FechaNacimiento || ''} onChange={handleChange} style={inputStyleExt} required />
                <input name="Curp" value={form.Curp || ''} onChange={handleChange} placeholder="CURP" style={inputStyleExt} required />
                <input name="Email" type="email" value={form.Email || ''} onChange={handleChange} placeholder="Correo" style={inputStyleExt} />
                <input name="Telefono" value={form.Telefono || ''} onChange={handleChange} placeholder="Teléfono" style={inputStyleExt} />
                <input name="Calle" value={form.Calle || ''} onChange={handleChange} placeholder="Calle" style={inputStyleExt} />
                <input name="NumE" value={form.NumE || ''} onChange={handleChange} placeholder="Número Exterior" style={inputStyleExt} />
                <input name="NumI" value={form.NumI || ''} onChange={handleChange} placeholder="Número Interior" style={inputStyleExt} />
                <input name="CP" value={form.CP || ''} onChange={handleChange} placeholder="Código Postal" style={inputStyleExt} />
                
                <select name="idGenero" value={form.idGenero || ''} onChange={handleChange} style={inputStyleExt} required>
                  <option value="">Género</option>
                  {datos.generos.map(genero => (
                    <option key={genero.idGenero} value={genero.idGenero}>{genero.Genero}</option>
                  ))}
                </select>
                <select name="idEstado" value={form.idEstado || ''} onChange={handleChange} style={inputStyleExt} required>
                  <option value="">Estado</option>
                  {datos.estados.map(estado => (
                    <option key={estado.idEstado} value={estado.idEstado}>{estado.Nombre}</option>
                  ))}
                </select>
                <select name="idMunicipio" value={form.idMunicipio || ''} onChange={handleChange} style={inputStyleExt} required>
                  <option value="">Municipio</option>
                  {municipiosFiltrados.map(municipio => (
                    <option key={municipio.idMunicipio} value={municipio.idMunicipio}>{municipio.Nombre}</option>
                  ))}
                </select>
                <select name="idLocalidad" value={form.idLocalidad || ''} onChange={handleChange} style={inputStyleExt} required>
                  <option value="">Localidad</option>
                  {localidadesFiltradas.map(localidad => (
                    <option key={localidad.idLocalidad} value={localidad.idLocalidad}>{localidad.Nombre}</option>
                  ))}
                </select>

                <div style={{ width: '100%', textAlign: 'right' }}>
                  <button type="submit" style={btnSubmitStyleExt(editId)}>{editId ? 'Actualizar' : 'Guardar'}</button>
                </div>
              </form>
            )}


            {modulo === 'alumnos' && (
              <form onSubmit={handleSubmit} style={formStyleExt}>
                <input name="Matricula" value={form.Matricula || ''} onChange={handleChange} placeholder="Matrícula" style={inputStyleExt} required disabled={!!editId} />
                
                <select name="idDatosP" value={form.idDatosP || ''} onChange={handleChange} style={inputStyleExt} required>
                  <option value="">Seleccione una persona</option>
                  {datos.datosPersonales.map(persona => (
                    <option key={persona.idDatosP} value={persona.idDatosP}>{persona.idDatosP} - {persona.Nombre}</option>
                  ))}
                </select>
                <select name="idCarrera" value={form.idCarrera || ''} onChange={handleChange} style={inputStyleExt} required>
                  <option value="">Seleccione una carrera</option>
                  {datos.carreras.filter(c => Number(c.Estatus) === 1).map(carrera => (
                    <option key={carrera.idCarrera} value={carrera.idCarrera}>{carrera.NombreCarreras}</option>
                  ))}
                </select>

                {editId && (
                  <select name="Status" value={form.Status || 'A'} onChange={handleChange} style={inputStyleExt}>
                    <option value="A">Activo</option>
                    <option value="B">Baja</option>
                  </select>
                )}
                
                <button type="submit" style={btnSubmitStyleExt(editId)}>{editId ? 'Actualizar' : 'Guardar'}</button>
              </form>
            )}


            {modulo === 'personal' && (
              <form onSubmit={handleSubmit} style={formStyleExt}>
                <input name="ClaveEmp" value={form.ClaveEmp || ''} onChange={handleChange} placeholder="Clave del empleado" style={inputStyleExt} required />
                
                <select name="idDatosP" value={form.idDatosP || ''} onChange={handleChange} style={inputStyleExt} required>
                  <option value="">Seleccione una persona</option>
                  {datos.datosPersonales.map(persona => (
                    <option key={persona.idDatosP} value={persona.idDatosP}>{persona.idDatosP} - {persona.Nombre}</option>
                  ))}
                </select>
                <select name="idTipo" value={form.idTipo || ''} onChange={handleChange} style={inputStyleExt} required>
                  <option value="">Tipo de personal</option>
                  {datos.tiposPersonal.map(tipo => (
                    <option key={tipo.idTipo} value={tipo.idTipo}>{tipo.Personal}</option>
                  ))}
                </select>

                {editId && (
                  <select name="Status" value={form.Status === undefined ? 1 : form.Status} onChange={handleChange} style={inputStyleExt}>
                    <option value={1}>Activo</option>
                    <option value={0}>Inactivo</option>
                  </select>
                )}

                <button type="submit" style={btnSubmitStyleExt(editId)}>{editId ? 'Actualizar' : 'Guardar'}</button>
              </form>
            )}

            <hr style={{ margin: '30px 0', border: '1px solid #e2e8f0' }} />

            <div className="table-responsive">
              {datosTabla.length > 0 && datosTabla[0] && typeof datosTabla[0] === 'object' ? (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px', minWidth: '600px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#0ea5e9', color: 'white' }}>
                      {Object.keys(datosTabla[0]).map(columna => (
                        <th key={columna} style={{ padding: '12px 15px', borderBottom: '2px solid #cbd5e1', textTransform: 'capitalize' }}>
                          {columna}
                        </th>
                      ))}
                      <th style={{ padding: '12px 15px', borderBottom: '2px solid #cbd5e1', textAlign: 'center' }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {datosTabla.map((fila, index) => (
                      <tr key={fila[idKeysMap[modulo]] ?? index} style={{ backgroundColor: index % 2 === 0 ? '#f8fafc' : '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
                        {Object.keys(fila).map(columna => (
                          <td key={columna} style={{ padding: '12px 15px', color: '#334155' }}>
                            {String(fila[columna] ?? '')}
                          </td>
                        ))}
                        <td style={{ padding: '12px 15px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                          <button style={btnEditStyleExt} onClick={() => editar(fila)}>Editar</button>
                          <button style={btnDeleteStyleExt} onClick={() => eliminar(fila[idKeysMap[modulo]])}>Eliminar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: '#64748b', background: '#f8fafc' }}>
                  No hay registros para mostrar en este módulo.
                </div>
              )}
            </div>

          </div>
        </main>
      </div>
    </>
  );
}

const formStyleExt = { 
  display: 'flex', gap: '15px', background: '#f1f5f9', padding: '20px', 
  borderRadius: '8px', alignItems: 'center', flexWrap: 'wrap' 
};

const inputStyleExt = { 
  flex: '1 1 180px', padding: '10px 15px', borderRadius: '6px', 
  border: '1px solid #cbd5e0', outline: 'none' 
};

const btnSubmitStyleExt = (editando) => ({
  background: editando ? '#f59e0b' : '#16a34a', color: '#fff', border: 'none', 
  padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'
});

const btnEditStyleExt = { 
  background: '#3b82f6', color: '#fff', border: 'none', padding: '6px 12px', 
  borderRadius: '4px', cursor: 'pointer', marginRight: '8px' 
};

const btnDeleteStyleExt = { 
  background: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', 
  borderRadius: '4px', cursor: 'pointer' 
};

export default App;