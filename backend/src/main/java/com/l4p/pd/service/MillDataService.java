package com.l4p.pd.service;


import com.l4p.pd.entity.MillData;
import com.l4p.pd.repository.MillDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MillDataService {

    @Autowired
    private MillDataRepository millDataRepository;

    /**
     * 磨房数据提交
     */
    public MillData submitMillData(MillData data) {
        // 数据校验逻辑可以添加在此处
        return millDataRepository.save(data);
    }
}
