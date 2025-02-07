package com.l4p.pd.controller;


import com.l4p.pd.entity.MillData;
import com.l4p.pd.service.MillDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 磨房数据提交接口
 */
@RestController
@RequestMapping("/api/mill-data")
public class MillDataController {

    @Autowired
    private MillDataService millDataService;

    @PostMapping
    public MillData submitMillData(@RequestBody MillData data) {
        return millDataService.submitMillData(data);
    }
}
