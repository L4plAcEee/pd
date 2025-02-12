package com.l4p.pd.controllers;

import com.l4p.pd.entity.Warehouse;
import com.l4p.pd.service.WarehouseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 仓库管理接口
 */
@RestController
@RequestMapping("/api/warehouse")
public class WarehouseController {

    @Autowired
    private WarehouseService warehouseService;

    // 查看仓库中所有产品信息
    @GetMapping
    public List<Warehouse> getWarehouseProducts() {
        return warehouseService.getWarehouseProducts();
    }

    // 添加产品进仓库
    @PostMapping("/inbound")
    public Warehouse inboundProduct(@RequestBody Warehouse warehouse) {
        return warehouseService.inboundProduct(warehouse);
    }
}
