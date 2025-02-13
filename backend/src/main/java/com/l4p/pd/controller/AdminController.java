package com.l4p.pd.controller;


import com.l4p.pd.entity.SupplierData;
import com.l4p.pd.entity.MillData;
import com.l4p.pd.entity.OtherDepartmentData;
import com.l4p.pd.repository.SupplierDataRepository;
import com.l4p.pd.repository.MillDataRepository;
import com.l4p.pd.repository.OtherDepartmentDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 管理端接口，查看各类数据
 */
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private SupplierDataRepository supplierDataRepository;

    @Autowired
    private MillDataRepository millDataRepository;

    @Autowired
    private OtherDepartmentDataRepository otherDepartmentDataRepository;

    // 查看供应商数据
    @GetMapping("/supplier-data")
    public List<SupplierData> getSupplierData() {
        return supplierDataRepository.findAll();
    }

    // 查看磨房数据
    @GetMapping("/mill-data")
    public List<MillData> getMillData() {
        return millDataRepository.findAll();
    }

    // 查看其他部门数据
    @GetMapping("/other-department-data")
    public List<OtherDepartmentData> getOtherDepartmentData() {
        return otherDepartmentDataRepository.findAll();
    }
}
