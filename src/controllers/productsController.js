import sql from 'mssql';
import config from '../db/config.js';

// GET /api/products
export const getProducts = async (req, res) => {
  try {
    let pool = await sql.connect(config.sql);
    const result = await pool.request().query('SELECT * FROM Products');
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Error while fetching products:', error);
    res.status(500).json({ error: 'Unable to fetch products' });
  } finally {
    sql.close();
  }
};

// POST /api/products
export const createProduct = async (req, res) => {
  try {
    const { product_name, category_id, supplier_id, price, quantity } = req.body;
    let pool = await sql.connect(config.sql);
    let insertProduct = await pool.request()
      .input('product_name', sql.VarChar, product_name)
      .input('category_id', sql.Int, category_id)
      .input('supplier_id', sql.Int, supplier_id)
      .input('price', sql.Decimal, price)
      .input('quantity', sql.Int, quantity)
      .query('INSERT INTO Products (product_name, category_id, supplier_id, price, quantity) VALUES (@product_name, @category_id, @supplier_id, @price, @quantity)');
      // io.emit('newProduct', product);
    res.status(201).json({ message: 'Product created successfully' });
  } catch (error) {
    console.error('Error while creating product:', error);
    res.status(500).json({ error: 'Unable to create product' });
  } finally {
    sql.close();
  }
};

// GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    const { product_id } = req.params;
    let pool = await sql.connect(config.sql);
    const result = await pool.request()
      .input('product_id', sql.Int, product_id)
      .query('SELECT * FROM Products WHERE product_id = @product_id');

    const product = result.recordset[0];
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error('Error while fetching product:', error);
    res.status(500).json({ error: 'Unable to fetch product' });
  } finally {
    sql.close();
  }
};

// PUT /api/products/:id
export const updateProduct = async (req, res) => {
  try {
    const { product_id } = req.params;
    const { product_name, category_id, supplier_id, price, quantity } = req.body;
    let pool = await sql.connect(config.sql);
    await pool.request()
      .input('product_id', sql.Int, product_id)
      .input('product_name', sql.VarChar, product_name)
      .input('category_id', sql.Int, category_id)
      .input('supplier_id', sql.Int, supplier_id)
      .input('price', sql.Decimal, price)
      .input('quantity', sql.Int, quantity)
      .query('UPDATE Products SET product_name = @product_name, category_id = @category_id, supplier_id = @supplier_id, price = @price, quantity = @quantity WHERE product_id = @product_id');

    res.status(200).json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error while updating product:', error);
    res.status(500).json({ error: 'Unable to update product' });
  } finally {
    sql.close();
  }
};

// DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  try {
    const { product_id } = req.params;
    let pool = await sql.connect(config.sql);
    await pool.request()
      .input('product_id', sql.Int, product_id)
      .query('DELETE FROM Products WHERE product_id = @product_id');

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error while deleting product:', error);
    res.status(500).json({ error: 'Unable to delete product' });
  } finally {
    sql.close();
  }
};
