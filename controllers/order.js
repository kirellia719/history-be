import sql from 'mssql';

export const order = async (req, res) => {
    try {
        const { ID_Khach_Hang, ID_Chi_Nhanh, Ghi_Chu, ID_Ma_Giam_Gia } = req.body;
        let query = `EXEC Dat_Hang @id_tai_khoan=${ID_Khach_Hang}, @id_chi_nhanh = ${ID_Chi_Nhanh}, @ghi_chu ='${Ghi_Chu}', @ma_giam_gia=${ID_Ma_Giam_Gia};`;
        const {recordset: data} = await sql.query(query);
        res.json(data);
    } catch (error) {
        res.status(500).json(error.message);
    }
}
export const confirmOrder = async (req, res) => {
    try {
        const { id: ID_Don_Hang } = req.params;
        let query = `UPDATE Don_Hang
        SET Trang_Thai = 'Thành công'
        WHERE ID = ${ID_Don_Hang};`;
        const {recordset: data} = await sql.query(query);
        res.json("Đã xác nhận");
    } catch (error) {
        console.log(error);
        res.status(500).json(error.message);
    }
}

export const getAllOrders = async (req, res) => {
    try {
        const { id } = req.params;
        const { year, status, order } = req.query;
        console.log(year, status, order);
        let query = `EXEC Xem_Don_Hang @id_tai_khoan = ${id}, @nam = ${year || null}, @status = '${status}',  @order = '${order}';`;
        console.log(query);
        const {recordset: data} = await sql.query(query);
        res.json(data);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const getSumOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { year = null } = req.query;
        let query = `SELECT dbo.Tinh_Tong_Chi_Phi_Trong_Nam(${id}, ${year}) AS Tong;`;
        const { recordset: data } = await sql.query(query);
        res.json(data[0].Tong);
    } catch (error) {
        res.status(500).json(error.message);
    }
}