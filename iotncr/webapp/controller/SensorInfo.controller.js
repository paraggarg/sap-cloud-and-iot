sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Sorter",
	"sap/m/MessageBox"
], function(Controller, JSONModel, Sorter, MessageBox) {
	"use strict";

	return Controller.extend("sap.iot.ncr.controller.SensorInfo", {
		onInit : function () {
			var sensorModel = new JSONModel({SensorDetail : [],
				intrusion : false
			}),
			oPopover = this.byId("idPopOver");
			this.setModel(sensorModel, "sensordata");
			oPopover.connect(this.byId("idVizFrame").getVizUid());
		},
		
		onAfterRendering : function () {
			this.readSensorData();
			jQuery.sap.intervalCall(1500, this, this.readSensorData);
		},
		
		onModelContextChange : function (oEvent) {
			if(this.getModel()) {
				this.readSensorData();
			}	
		},
		
		getModel : function (sName) {
			return this.getView().getModel(sName);
		},
		
		readSensorData : function () {
			var oModel = this.getModel();
			oModel.read("/SensorDetail", {
				sorters : [new Sorter("G_CREATED", true)],
				success : this.onSuccessSensorDataRead.bind(this),
				error : this.onErrorSensorDataRead.bind(this)
			});
		},
		
		onSuccessSensorDataRead : function (oData) {
			this.getModel("sensordata").setProperty("/SensorDetail", oData.results);
			if (oData.results[0].C_ISPASSED === 1) {
				this.getModel("sensordata").setProperty("/intrusion", true);
			} else {
				this.getModel("sensordata").setProperty("/intrusion", false);
			}
		},
		
		onErrorSensorDataRead : function (oError) {
			MessageBox.error("Service error, contact your administrator");
		},
		
		setModel : function (oModel, sName) {
			this.getView().setModel(oModel, sName);
		},
		
		byId : function (sId) {
			return this.getView().byId(sId);
		}
	});
});