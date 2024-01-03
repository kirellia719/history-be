import sql from 'mssql';

export const createComment = async (req, res) => {
    try {
        const { ID_Tai_Khoan, Mo_Ta, So_Diem } = req.body;
        const { id: ID_San_Pham } = req.params;
        let query = `EXEC Danh_Gia_San_Pham @id_tai_khoan=${ID_Tai_Khoan}, @id_san_pham = ${ID_San_Pham}, @mo_ta = '${Mo_Ta}' , @so_diem = ${So_Diem};`;
        const {recordset: data} = await sql.query(query);
        res.json(data);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const deteleComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { ID_Tai_Khoan } = req.body;
        let query = `EXEC Xoa_Danh_Gia @id=${id}, @id_tai_khoan = ${ID_Tai_Khoan}`;
        const {recordset: data} = await sql.query(query);
        res.json("Đã xóa");
    } catch (error) {
        console.log(error);
        res.status(500).json(error.message);
    }
}

export const editComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { So_Diem, Mo_Ta, ID_Tai_Khoan } = req.body;
        let query = `EXEC Sua_Danh_Gia @id =${id}, @id_tai_khoan = ${ID_Tai_Khoan}, @mo_ta = '${Mo_Ta}', @so_diem=${So_Diem}`;
        const {recordset: data} = await sql.query(query);
        res.json("Đã sửa");
    } catch (error) {
        console.log(error);
        res.status(500).json(error.message);
    }
}

export const getAllComments = async (req, res) => {
    try {
        const { id } = req.params;
        let query = `SELECT dg.*, tk.Ten
        FROM Danh_Gia dg
        JOIN Tai_Khoan tk ON dg.ID_Tai_Khoan = tk.ID
        WHERE dg.ID_San_Pham = ${id}
        ORDER BY dg.Thoi_Gian DESC;`;
        const {recordset: data} = await sql.query(query);
        res.json(data);
    } catch (error) {
        res.status(500).json(error.message);
    }
}