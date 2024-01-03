import sql from 'mssql';

export const getTinh = async (req, res) => {
    try {
        const query = `SELECT * FROM Tinh ORDER BY ID`;
        const {recordset: data} = await sql.query(query);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json(error.message);
    }
}

export const getHuyen = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `SELECT * FROM Quan_Huyen WHERE ID_Tinh = ${id}`;
        const {recordset: data} = await sql.query(query);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json(error.message);
    }
}

export const getXa = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `SELECT * FROM Phuong_Xa WHERE ID_Quan_Huyen = ${id}`;
        const {recordset: data} = await sql.query(query);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json(error.message);
    }
}