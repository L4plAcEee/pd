package com.l4p.pd.service;

import com.l4p.pd.entity.MillData;
import com.l4p.pd.entity.QualityRecord;
import com.l4p.pd.repository.MillDataRepository;
import com.l4p.pd.repository.QualityRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QualityControlService {

    @Autowired
    private MillDataRepository millDataRepository;

    @Autowired
    private QualityRecordRepository qualityRecordRepository;

    /**
     * 获取待品控的磨房产品（品控状态为 "待检"）
     */
    public List<MillData> getPendingQualityCheck() {
        return millDataRepository.findByQualityStatus("待检");
    }

    /**
     * 提交品控结果
     */
    public QualityRecord submitQualityResult(Long millDataId, Integer qualifiedQuantity, String status, String reason) {
        MillData millData = millDataRepository.findById(millDataId)
                .orElseThrow(() -> new RuntimeException("产品不存在"));
        millData.setQualityStatus(status);
        millDataRepository.save(millData);

        QualityRecord record = new QualityRecord();
        record.setMillData(millData);
        record.setQualifiedQuantity(qualifiedQuantity);
        record.setStatus(status);
        record.setReason(reason);

        return qualityRecordRepository.save(record);
    }
}
