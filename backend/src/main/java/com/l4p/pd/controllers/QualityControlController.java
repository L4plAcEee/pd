package com.l4p.pd.controllers;


import com.l4p.pd.entity.MillData;
import com.l4p.pd.entity.QualityRecord;
import com.l4p.pd.service.QualityControlService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 品控相关接口
 */
@RestController
@RequestMapping("/api/quality")
public class QualityControlController {

    @Autowired
    private QualityControlService qualityControlService;

    // 获取待品控产品
    @GetMapping("/pending")
    public List<MillData> getPendingQuality() {
        return qualityControlService.getPendingQualityCheck();
    }

    // 提交品控结果
    @PostMapping("/submit")
    public QualityRecord submitQuality(@RequestParam Long millDataId,
                                       @RequestParam Integer qualifiedQuantity,
                                       @RequestParam String status,
                                       @RequestParam(required = false) String reason) {
        return qualityControlService.submitQualityResult(millDataId, qualifiedQuantity, status, reason);
    }
}
