import sql from 'mssql'
import config from '../db/config.js';
export const getCategories = async (req, res) => {
  try {
    let pool = await sql.connect(config.sql)
    const result = await pool.request().query('SELECT * FROM Categories');

    const categories = result.recordset;
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error while fetching Categories:', error);
    res.status(500).json({ error: 'Unable to fetch Categories' });
  } finally {
    await sql.close();
  }
};

// POST /api/Categories
export const createCategory = async (req, res) => {
  try {
    let pool = await sql.connect(config.sql)
    const { category_name } = req.body;

    const result = await pool
      .request()
      .input('category_name', category_name)
      .query('INSERT INTO Categories (category_name) VALUES (@category_name);');

      res.status(201).json({ message: 'Category created successfully'} );
  } catch (error) {
    console.error('Error while creating Category:', error);
    res.status(500).json({ error: 'Unable to create Category' });
  } finally {
    await sql.close();
  }
};

// GET /api/Categorys/:id
export const getCategoryById = async (req, res) => {
  try {
    let pool = await sql.connect(config.sql)
    const { category_id } = req.params;

    const result = await pool
      .request()
      .input('category_id', category_id)
      .query('SELECT * FROM Categories WHERE category_id = @category_id');

    const category = result.recordset[0];
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.status(200).json(category);
  } catch (error) {
    console.error('Error while fetching Category:', error);
    res.status(500).json({ error: 'Unable to fetch Category' });
  } finally {
    await sql.close();
  }
};

// PUT /api/Categorys/:id
export const updateCategory = async (req, res) => {
  try {
    let pool = await sql.connect(config.sql)

    const { category_id } = req.params;
    const { category_name } = req.body;
    const result = await pool
      .request()
      .input('category_id', category_id)
      .input('category_name', category_name)
      .query('UPDATE Categories SET category_name = @category_name WHERE category_id = @category_id');

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const updatedCategory = await Category.findByPk(category_id);

    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error('Error while updating Category:', error);
    res.status(500).json({ error: 'Unable to update Category' });
  } finally {
    await sql.close();
  }
};

// DELETE /api/Categorys/:id
export const deleteCategory = async (req, res) => {
  try {
    let pool = await sql.connect(config.sql)
    const { category_id } = req.params;

    const result = await pool
      .request()
      .input('category_id', category_id)
      .query('DELETE FROM Categories WHERE category_id = @category_id');

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error while deleting Category:', error);
    res.status(500).json({ error: 'Unable to delete Category' });
  } finally {
    await pool.close();
  }
};
