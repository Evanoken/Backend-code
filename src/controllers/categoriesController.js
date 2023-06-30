import ConnectionPool from 'mssql'
//import Supplier from '../models/supplier'

const pool = new ConnectionPool(config);

// GET /api/suppliers
export const getSuppliers = async (req, res) => {
  try {
    await pool.connect();

    const result = await pool.request().query('SELECT * FROM suppliers');

    const suppliers = result.recordset;
    res.status(200).json(suppliers);
  } catch (error) {
    console.error('Error while fetching suppliers:', error);
    res.status(500).json({ error: 'Unable to fetch suppliers' });
  } finally {
    await pool.close();
  }
};

// POST /api/suppliers
export const createSupplier = async (req, res) => {
  try {
    await pool.connect();

    const { name, email, phone } = req.body;

    const result = await pool
      .request()
      .input('name', name)
      .input('email', email)
      .input('phone', phone)
      .query('INSERT INTO suppliers (name, email, phone) VALUES (@name, @email, @phone);');

    const createdSupplier = await Supplier.create({ name, email, phone });

    res.status(201).json(createdSupplier);
  } catch (error) {
    console.error('Error while creating supplier:', error);
    res.status(500).json({ error: 'Unable to create supplier' });
  } finally {
    await pool.close();
  }
};

// GET /api/suppliers/:id
export const getSupplierById = async (req, res) => {
  try {
    await pool.connect();

    const { id } = req.params;

    const result = await pool
      .request()
      .input('id', id)
      .query('SELECT * FROM suppliers WHERE id = @id');

    const supplier = result.recordset[0];
    if (!supplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    res.status(200).json(supplier);
  } catch (error) {
    console.error('Error while fetching supplier:', error);
    res.status(500).json({ error: 'Unable to fetch supplier' });
  } finally {
    await pool.close();
  }
};

// PUT /api/suppliers/:id
export const updateSupplier = async (req, res) => {
  try {
    await pool.connect();

    const { id } = req.params;
    const { name, email, phone } = req.body;

    const result = await pool
      .request()
      .input('id', id)
      .input('name', name)
      .input('email', email)
      .input('phone', phone)
      .query('UPDATE suppliers SET name = @name, email = @email, phone = @phone WHERE id = @id');

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    const updatedSupplier = await Supplier.findByPk(id);

    res.status(200).json(updatedSupplier);
  } catch (error) {
    console.error('Error while updating supplier:', error);
    res.status(500).json({ error: 'Unable to update supplier' });
  } finally {
    await pool.close();
  }
};

// DELETE /api/suppliers/:id
export const deleteSupplier = async (req, res) => {
  try {
    await pool.connect();

    const { id } = req.params;

    const result = await pool
      .request()
      .input('id', id)
      .query('DELETE FROM suppliers WHERE id = @id');

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    res.status(200).json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    console.error('Error while deleting supplier:', error);
    res.status(500).json({ error: 'Unable to delete supplier' });
  } finally {
    await pool.close();
  }
};
