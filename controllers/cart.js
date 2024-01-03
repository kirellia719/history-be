import sql from 'mssql';

export const getCart = async (req, res) => {
    try {
        const { id } = req.params;
        let query = `EXEC Xem_Gio_Hang @id_khach_hang = ${id};`;
        const {recordset: data} = await sql.query(query);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json(error.message);
    }
}



export const addToCart = async (req, res) => {
    try {
        const { ID_Tai_Khoan, ID_San_Pham, Thong_So_Rieng, Gia = null } = req.body;
        let query = `EXEC Them_Vao_Gio @id_khach_hang=${ID_Tai_Khoan}, @id_san_pham=${ID_San_Pham}, @thong_so_rieng = '${Thong_So_Rieng}', @Gia=${Gia};`;
        const {recordset: data} = await sql.query(query);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json(error.message);
    }
}

export const removeFromCart = async (req, res) => {
    try {
        const {ID_Tai_Khoan, ID_San_Pham, Thong_So_Rieng } = req.body;
        let query = `EXEC Lay_Khoi_Gio @id_khach_hang=${ID_Tai_Khoan}, @id_san_pham=${ID_San_Pham}, @thong_so_rieng = '${Thong_So_Rieng}';`;
        const {recordset: data} = await sql.query(query);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json(error.message);
    }
}


export const checkVoucher = async (req, res) => {
    try {
        const { ID_Tai_Khoan, ID_The_Giam_Gia } = req.body;
        let query = `SELECT dbo.Kiem_Tra_The_Giam_Gia(${ID_Tai_Khoan}, ${ID_The_Giam_Gia}) AS Thong_Bao`;
        const { recordset: data } = await sql.query(query);
        if (data[0].Thong_Bao == "Hợp lệ") {
            res.json(data[0].Thong_Bao);
        } else {
            res.status(404).json(data[0].Thong_Bao);
        }
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const getVoucher = async (req, res) => {
    try {
        const { ID_Tai_Khoan } = req.body;
        const { id: ID_The_Giam_Gia } = req.params;
        let query = `EXEC Lay_The_Giam_Gia @TaiKhoanID = ${ID_Tai_Khoan}, @TheGiamGiaID = ${ID_The_Giam_Gia};`;
        const { recordset: data } = await sql.query(query);
        res.json(data[0]);
    } catch (error) {
        res.status(500).json(error.message);
    }
}