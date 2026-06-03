const { run, get, all } = require('../config/database-sqlite');

exports.getAllRegions = async (req, res) => {
  try {
    const regions = await all('SELECT * FROM regions ORDER BY nom ASC');

    res.json({
      success: true,
      count: regions.length,
      data: regions
    });
  } catch (error) {
    console.error('Erreur getAllRegions:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur recup régions',
      error: error.message
    });
  }
};

exports.getRegionById = async (req, res) => {
  try {
    const { id } = req.params;
    const region = await get('SELECT * FROM regions WHERE id = ?', [id]);

    if (!region) {
      return res.status(404).json({
        success: false,
        message: 'Région non trouvée'
      });
    }

    res.json({
      success: true,
      data: region
    });
  } catch (error) {
    console.error('Erreur getRegionById:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur recup région',
      error: error.message
    });
  }
};

exports.createRegion = async (req, res) => {
  try {
    const { nom, description, image_url } = req.body;

    const result = await run(`
      INSERT INTO regions (nom, description, image_url, created_at)
      VALUES (?, ?, ?, datetime('now'))
    `, [nom, description, image_url]);

    const region = await get('SELECT * FROM regions WHERE id = ?', [result.lastID]);

    res.status(201).json({
      success: true,
      message: 'Région créée',
      data: region
    });
  } catch (error) {
    console.error('Erreur createRegion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur création région',
      error: error.message
    });
  }
};

exports.updateRegion = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, description, image_url } = req.body;

    await run(`
      UPDATE regions
      SET nom = COALESCE(?, nom),
          description = COALESCE(?, description),
          image_url = COALESCE(?, image_url),
          updated_at = datetime('now')
      WHERE id = ?
    `, [nom, description, image_url, id]);

    const region = await get('SELECT * FROM regions WHERE id = ?', [id]);

    if (!region) {
      return res.status(404).json({
        success: false,
        message: 'Région non trouvée'
      });
    }

    res.json({
      success: true,
      message: 'Région mise à jour',
      data: region
    });
  } catch (error) {
    console.error('Erreur updateRegion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur update région',
      error: error.message
    });
  }
};

exports.deleteRegion = async (req, res) => {
  try {
    const { id } = req.params;

    await run('DELETE FROM regions WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Région supprimée'
    });
  } catch (error) {
    console.error('Erreur deleteRegion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur suppression région',
      error: error.message
    });
  }
};
