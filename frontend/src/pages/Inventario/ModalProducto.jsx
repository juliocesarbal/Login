import { useState, useEffect, useRef } from "react";
import "./ModalProducto.css";

const ModalProducto = ({
  open,
  onClose,
  onSubmit,
  producto,
  proveedores,
  ofertas,
  categoriaId,
  sucursalId,
  modo,
}) => {
  const [form, setForm] = useState({
    nombre: "",
    unidad_medida: "",
    precio_venta: "",
    precio_compra: "",
    iva: "",
    stock: "",
    stock_minimo: "",
    url_image: "",
    descripcion: "",
    esta_activo: true,
    proveedor_id: "",
    oferta_id: "",
    sucursal_id: sucursalId,
  });

  const inputRef = useRef();

  const resetForm = () => {
    setForm({
      nombre: "",
      unidad_medida: "",
      precio_venta: "",
      precio_compra: "",
      iva: "",
      stock: "",
      stock_minimo: "",
      url_image: "",
      descripcion: "",
      esta_activo: true,
      proveedor_id: "",
      oferta_id: "",
      sucursal_id: sucursalId,
    });
  };

  useEffect(() => {
    if (open) {
      if (producto) {
        setForm({
          nombre: producto.nombre || "",
          unidad_medida: producto.unidad_medida || "",
          precio_venta: producto.precio_venta || "",
          precio_compra: producto.precio_compra || "",
          iva: producto.iva || "",
          stock: producto.stock || "",
          stock_minimo: producto.stock_minimo || "",
          url_image: producto.url_image || "",
          descripcion: producto.descripcion || "",
          esta_activo: producto.esta_activo ?? true,
          oferta_id: producto.id_descuento || "",
          proveedor_id: producto.id_proveedor || "",
          sucursal_id: producto.id_sucursal || sucursalId,
        });
      } else {
        resetForm();
      }
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [open, producto, sucursalId]);

  useEffect(() => {
    const ofertaSeleccionada = ofertas.find((o) => o.id === form.oferta_id);
    setForm((prev) => ({
      ...prev,
      descuento: ofertaSeleccionada ? ofertaSeleccionada.porcentaje : 0,
    }));
  }, [form.oferta_id, ofertas]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Si es number y menor que 0, no actualices
    if (type === "number" && value !== "" && parseFloat(value) < 0) {
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = () => {
    const {
      nombre,
      unidad_medida,
      precio_venta,
      precio_compra,
      iva,
      stock,
      stock_minimo,
    } = form;

    // Validar campos obligatorios
    if (!nombre || !unidad_medida || !precio_venta) {
      alert("Nombre, unidad y precio de venta son obligatorios.");
      return;
    }

    // Validar números negativos
    if (
      precio_venta < 0 ||
      precio_compra < 0 ||
      iva < 0 ||
      stock < 0 ||
      stock_minimo < 0
    ) {
      alert("No se permiten valores negativos.");
      return;
    }

    // Validar que stock mínimo no sea mayor o igual a stock
    if (parseFloat(stock_minimo) >= parseFloat(stock)) {
      alert("El stock mínimo debe ser menor al stock.");
      return;
    }

    onSubmit({ ...form, categoria_id: categoriaId, sucursal_id: sucursalId });
  };

  if (!open) return null;

  return (
    <div className="modal-producto-backdrop">
      <div className="modal-producto-contenido">
        <h2>{modo === "editar" ? "Editar Producto" : "Nuevo Producto"}</h2>

        <label htmlFor="nombre">Nombre</label>
        <input
          ref={inputRef}
          id="nombre"
          name="nombre"
          className={!form.nombre ? "input-error" : ""}
          value={form.nombre}
          onChange={handleChange}
          autoComplete="off"
        />

        <label htmlFor="unidad_medida">Unidad de medida</label>
        <input
          id="unidad_medida"
          name="unidad_medida"
          className={!form.unidad_medida ? "input-error" : ""}
          value={form.unidad_medida}
          onChange={handleChange}
          autoComplete="off"
        />

        <label htmlFor="precio_venta">Precio venta</label>
        <input
          id="precio_venta"
          name="precio_venta"
          type="number"
          onWheel={(e) => e.target.blur()}
          className={!form.precio_venta ? "input-error" : ""}
          value={form.precio_venta}
          onChange={handleChange}
          autoComplete="off"
        />

        <label htmlFor="precio_compra">Precio compra</label>
        <input
          id="precio_compra"
          name="precio_compra"
          type="number"
          onWheel={(e) => e.target.blur()}
          value={form.precio_compra}
          onChange={handleChange}
          autoComplete="off"
        />

        <label htmlFor="iva">IVA (%)</label>
        <input
          id="iva"
          name="iva"
          type="number"
          onWheel={(e) => e.target.blur()}
          value={form.iva}
          onChange={handleChange}
          autoComplete="off"
        />

        <label htmlFor="stock">Stock</label>
        <input
          id="stock"
          name="stock"
          type="number"
          onWheel={(e) => e.target.blur()}
          value={form.stock}
          onChange={handleChange}
          autoComplete="off"
        />

        <label htmlFor="stock_minimo">Stock mínimo</label>
        <input
          id="stock_minimo"
          name="stock_minimo"
          type="number"
          onWheel={(e) => e.target.blur()}
          value={form.stock_minimo}
          onChange={handleChange}
          autoComplete="off"
        />

        <label htmlFor="url_image">URL de imagen</label>
        <input
          id="url_image"
          name="url_image"
          value={form.url_image}
          onChange={handleChange}
          autoComplete="off"
        />

        <label htmlFor="descripcion">Descripción</label>
        <input
          id="descripcion"
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          autoComplete="off"
        />

        <div className="switch-group">
          <span>Activo</span>
          <label className="switch">
            <input
              type="checkbox"
              name="esta_activo"
              checked={form.esta_activo}
              onChange={handleChange}
            />
            <span className="slider"></span>
          </label>
        </div>

        <label htmlFor="proveedor_id">Proveedor</label>
        <select
          name="proveedor_id"
          id="proveedor_id"
          value={form.proveedor_id}
          onChange={handleChange}
        >
          <option value="">Seleccione proveedor</option>
          {proveedores.map((prov) => (
            <option key={prov.id} value={prov.id}>
              {prov.nombre}
            </option>
          ))}
        </select>

        <label htmlFor="oferta_id">Oferta</label>
        <select
          name="oferta_id"
          id="oferta_id"
          value={form.oferta_id}
          onChange={handleChange}
        >
          <option value="">Sin oferta</option>
          {ofertas.map((oferta) => (
            <option key={oferta.id} value={oferta.id}>
              {oferta.nombre} - {oferta.porcentaje}% desc.
            </option>
          ))}
        </select>

        <div className="modal-actions">
          <button onClick={handleSubmit}>Guardar</button>
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="btn-cancelar"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalProducto;
