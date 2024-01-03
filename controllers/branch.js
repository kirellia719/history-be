import sql from 'mssql';

export const getBranches = async (req, res) => {
    try {
        const query = `
            SELECT cn.ID, cn.Ten, cn.ID_Phuong_Xa, px.Ten as Ten_Phuong_Xa, qh.Ten AS Ten_Quan_Huyen, t.Ten AS Ten_Tinh
            FROM Chi_Nhanh cn
            JOIN Phuong_Xa px ON cn.ID_Phuong_Xa = px.ID
            JOIN Quan_Huyen qh ON px.ID_Quan_Huyen  = qh.ID
            JOIN Tinh t ON qh.ID_Tinh  = t.ID
            ORDER BY cn.ID;
        `;
        const { recordset: data } = await sql.query(query);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json(error.message);
    }
}