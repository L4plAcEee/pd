package com.l4p.pd.service;


import com.l4p.pd.entity.SupplierData;
import com.l4p.pd.repository.SupplierDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SupplierDataService {

    @Autowired
    private SupplierDataRepository supplierDataRepository;

    /**
     * 供应商数据提交
     */
    public SupplierData submitSupplierData(SupplierData data) {
        // 数据校验逻辑可以添加在此处
        return supplierDataRepository.save(data);
    }
}
