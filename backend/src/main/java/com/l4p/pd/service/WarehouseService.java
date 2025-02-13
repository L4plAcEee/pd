package com.l4p.pd.service;


import com.l4p.pd.entity.Warehouse;
import com.l4p.pd.repository.WarehouseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WarehouseService {

    @Autowired
    private WarehouseRepository warehouseRepository;

    /**
     * 获取仓库中所有产品信息
     */
    public List<Warehouse> getWarehouseProducts() {
        return warehouseRepository.findAll();
    }

    /**
     * 添加产品进仓库
     */
    public Warehouse inboundProduct(Warehouse warehouse) {
        // 业务逻辑：可设置入库时间等
        return warehouseRepository.save(warehouse);
    }
}
