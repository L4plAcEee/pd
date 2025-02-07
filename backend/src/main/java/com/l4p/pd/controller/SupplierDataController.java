package com.l4p.pd.controller;


import com.l4p.pd.entity.SupplierData;
import com.l4p.pd.service.SupplierDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 供应商数据提交接口
 */
@RestController
@RequestMapping("/api/supplier-data")
public class SupplierDataController {

    @Autowired
    private SupplierDataService supplierDataService;

    @PostMapping
    public SupplierData submitSupplierData(@RequestBody SupplierData data) {
        return supplierDataService.submitSupplierData(data);
    }
}
