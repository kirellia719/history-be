import sql from 'mssql';

export const login = async (req, res) => {
    try {
        const { sdt, mat_khau } = req.body;
        const records = await sql.query(`SELECT * FROM Tai_Khoan WHERE SDT='${sdt}' AND Mat_Khau='${mat_khau}'`);
        const data = records.recordset;
        if (data.length > 0) {
            res.json(data[0]);
        } else {
            res.status(404).json("Sai số điện thoại hoặc mật khẩu");
        }
    } catch (error) {
        console.error(error);
        res.status(500).json(error.message);
    }
}