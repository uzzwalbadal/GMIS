import { Component, OnInit, NgZone } from '@angular/core';


import { Map, geoJSON, icon, latLng, Layer, marker, polygon, tileLayer } from 'leaflet';
import { LeafletLayersDemoModel } from './layers-demo.model';
//import Districts from '../../assets/geojson/DistrictsofNepal.json';
//import IPCommandArea from '../../assets/geojson/IPCommandArea_3.json';
//import IPHeadWorks from '../../assets/geojson/IPHeadworks.json';
//import IPCanal from '../../assets/geojson/IPCanalNetwork.json';
import { MatDialog } from '@angular/material';
import { DocumentServiceProxy, DocumentDto, ListResultDtoOfDocumentDto } from '@shared/service-proxies/service-proxies';
import { CustomCommonService } from '@shared/dateconvertor.service';
import { DocumentUploadComponent } from 'gmis/document-upload/document-upload.component';
import { finalize } from 'rxjs/operators';
import { AppConsts } from '@shared/AppConsts';
import { GeoJsonService } from './json.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styles: [``]
})
export class MapComponent {
  IPHeadWorks:any;
  IPCanal:any;
  Districts:any;
  IPCommandArea:any;
  baseUrl: string;
  
  clicked = '';
  LAYER_GOOGLE = {
    id: 'googlesatellite',
    name: 'Google Satellite',
    // tslint:disable-next-line:indent
    enabled: true,
    layer: tileLayer('http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}', {
      maxZoom: 18,
      opacity: 1.0,
      attribution: 'Google Satellite'
    })
  };
  // LAYER_OCM = {
  //   id: 'opencyclemap',
  //   name: 'Open Cycle Map',
  //   enabled: true,
  //   layer: tileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png', {
  //     maxZoom: 18,
  //     attribution: 'Open Cycle Map'
  //   })
  // };
  LAYER_OSM = {
    id: 'openstreetmap',
    name: 'Open Street Map',
    enabled: false,
    layer: tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: 'Open Street Map'
    })
  };


  // marker = {
  //   id: 'marker',
  //   name: 'Site',
  //   image: '../../assets/leaflet/images/IPHeadwork.png',
  //   enabled: true,
  //   layer: marker([ 27.7172, 85.3240 ], 
  //     { 	icon: icon({
  //       iconSize: [ 25, 41 ],
  //       iconAnchor: [ 13, 41 ],
  //       iconUrl: '../../assets/icons/marker-icon.png',
  //       shadowUrl: '../../assets/icons/marker-shadow.png',
  //             }),
  //             riseOnHover:true
  //   }).bindTooltip('Kathmandu', {
  //     permanent: true,
  //     opacity: 1,
  //     direction: 'top'
  //     })
  // };
  ipCommand = {
    id: 'IPCommand',
    name: 'IPCommand',
    image: '../../assets/leaflet/images/IPCommand.png',

    enabled: true,
    layer: geoJSON(
      (this.IPCommandArea) as any,
      {
        onEachFeature: this.pop_IPCommandArea_3.bind(this), style: () => ({
          opacity: 1,
          color: 'rgba(35,35,35,1.0)',
          dashArray: '',
          lineCap: 'butt',
          lineJoin: 'miter',
          weight: 1.0,
          fill: true,
          fillOpacity: 1,
          fillColor: 'rgba(190,176,232,1.0)'
        })
      })
  };
  headWorks = {
    id: 'HeadWorks',
    name: 'IPCommand',
    image: '../../assets/leaflet/images/IPHeadwork.png',

    enabled: true,
    layer: geoJSON(
      (this.IPHeadWorks) as any,
      {
        onEachFeature: this.pop_IPHeadworks_5.bind(this), style: () => ({
          radius: 4.0,
          opacity: 1,
          color: 'rgba(35,35,35,1.0)',
          dashArray: '',
          lineCap: 'butt',
          lineJoin: 'miter',
          weight: 1.0,
          fill: true,
          fillOpacity: 1,
          fillColor: 'rgba(226,239,47,1.0)'
        })
      })
  };
  ipCanal = {
    id: 'IPCanal',
    name: 'IP Canal',
    image: '../../assets/leaflet/images/IPCanal.png',

    enabled: true,
    layer: geoJSON(
      (this.IPCanal) as any,
      {
        onEachFeature: this.pop_IPHeadworks_5.bind(this), style: () => ({
          opacity: 1,
          color: 'rgba(47,43,127,1.0)',
          dashArray: '',
          lineCap: 'square',
          lineJoin: 'bevel',
          weight: 1.0,
          fillOpacity: 0,
        })
      })
  };

  district1 = {
    id: 'district',
    name: 'Districts',
    image: '../../assets/leaflet/images/District.png',

    enabled: true,
    layer: geoJSON((this.Districts) as any, {
      onEachFeature: this.pop_DistrictsofNepal_2.bind(this), style: () => ({ opacity: 1, color: 'rgba(255,59,0,1.0)', dashArray: '', lineCap: 'butt', lineJoin: 'miter', weight: 1.0, fill: true, fillOpacity: 1, fillColor: 'rgba(125,139,143,0.0)' })
    })

  };

  // district = {
  // 	id: 'district',
  // 	name: 'Geo JSON Polygon',
  // 	enabled: true,
  // 	layer: geoJSON(

  // 		(Districts) as any,
  // 		{ style: () => ({ color: '#df2d00' })})
  // };



  // Form model object
  model = new LeafletLayersDemoModel(
    // [ this.LAYER_OSM, this.LAYER_OCM, this.LAYER_GOOGLE ],
    [this.LAYER_OSM, this.LAYER_GOOGLE],
    this.LAYER_OSM.id,
    [this.district1, this.ipCommand, this.ipCanal, this.headWorks]
  );



  // Values to bind to Leaflet Directive
  layers: Layer[];
  layersControl = {
    overlays: {
      '<img src="../../assets/icons/marker-icon.png" height="22px" /> IP Headworks': this.headWorks.layer,
      '<img src="../../assets/leaflet/images/IPCanal.png" /> IP Canal Network': this.ipCanal.layer,
      '<img src="../../assets/leaflet/images/IPCommand.png" /> IP Command Area': this.ipCommand.layer,
      '<img src="../../assets/leaflet/images/District.png" /> Districts of Nepal': this.district1.layer,

    },
    baseLayers: {
      'Open Street Map': this.LAYER_OSM.layer,
      // 'Open Cycle Map': this.LAYER_OCM.layer,
      'Google Satellite': this.LAYER_GOOGLE.layer,

    }




  };
  options = {
    zoom: 6,
    center: latLng(28.26689, 83.96851)
  };
  layersControlOptions = {
    collapsed: false,
    hideSingleBase: true
  };

  constructor(private zone: NgZone,
    public _dialog: MatDialog,
    private _documentServiceProxy: DocumentServiceProxy,
    private _commonService : CustomCommonService,
    private geoService:GeoJsonService
    ) {

       
        
       
        this.geoService.getGeoJson('./../assets/geojson/IPHeadworks.json').subscribe((data1: any) => {
          this.geoService.getGeoJson('./../assets/geojson/IPCanalNetwork.json').subscribe((data2: any) => {
            this.geoService.getGeoJson('./../assets/geojson/IPCommandArea_3.json').subscribe((data3: any) => {
              this.geoService.getGeoJson('./../assets/geojson/DistrictsofNepal.json').subscribe((data4: any) => {
                    this.district1.layer.addData(data4);
                    this.ipCommand.layer.addData(data3);
                    this.ipCanal.layer.addData(data2);
                    this.headWorks.layer.addData(data1);
                });            
            });           
        });    
        this.apply();
        });
    
  }

  pop_DistrictsofNepal_2(feature, layer) {
    var popupContent = `<table>
          <tr>
            <th scope="row">Pradesh</th>
            <td>` + (feature.properties['Pradesh'] !== null ? feature.properties['Pradesh'].toString() : '') + `</td>
          </tr>
          <tr>
            
            <td colspan="2">` + (feature.properties['District'] !== null ? feature.properties['District'].toString() : '') + `</td>
          </tr>
        </table>`;
    layer.bindPopup(popupContent, { maxHeight: 400 });


  }
  pop_IPHeadworks_5(feature, layer) {
    var popupContent = `<table>
              <tr>
                  <th scope="row"></th>
                  <td>` + (feature.properties['Name'] !== null ? feature.properties['Name'].toString() : '') + `</td>
              </tr>
          </table>`;
    layer.bindPopup(popupContent, { maxHeight: 400 });
  }
  pop_IPCommandArea_3(feature, layer) {
    var popupContent = `<table>
            <tr>
                <th scope="row">Name</th>
                <td>` + (feature.properties['Name'] !== null ? feature.properties['Name'] : '') + `</td>
            </tr>
            <tr>
                <th scope="row">River Source</th>
                <td>` + (feature.properties['Riv_Source'] !== null ? feature.properties['Riv_Source'] : '') + `</td>
            </tr>
            <tr>
                <th scope="row">Headworks Type</th>
                <td>` + (feature.properties['HW_Type'] !== null ? feature.properties['HW_Type'] : '') + `</td>
            </tr>
            <tr>
                <th scope="row">Flood Discharge (m3/s)</th>
                <td>` + (feature.properties['FloodQ_m3s'] !== null ? feature.properties['FloodQ_m3s'] : '') + `</td>
            </tr>
            <tr>
                <th scope="row">Net Command Area (ha)</th>
                <td>` + (feature.properties['NCA_ha'] !== null ? feature.properties['NCA_ha'] : '') + `</td>
            </tr>
            <tr>
                <th scope="row">No. of Main Canals</th>
                <td>` + (feature.properties['MainCanal'] !== null ? feature.properties['MainCanal'] : '') + `</td>
            </tr>
            <tr>
                <th scope="row">Left MC Design Discharge (m3/s)</th>
                <td>` + (feature.properties['L_MC_Q_m3s'] !== null ? feature.properties['L_MC_Q_m3s'] : '') + `</td>
            </tr>
            <tr>
                <th scope="row">Right MC Design Discharge (m3/s)</th>
                <td>` + (feature.properties['R_MC_Q_m3s'] !== null ? feature.properties['R_MC_Q_m3s'] : '') + `</td>
            </tr>
            <tr>
                <th scope="row">Total Population</th>
                <td>` + (feature.properties['Population'] !== null ? feature.properties['Population'] : '') + `</td>
            </tr>
            <tr>
                <th scope="row">Cropping Intensity (%)</th>
                <td>` + (feature.properties['Crop_Ints'] !== null ? feature.properties['Crop_Ints'] : '') + `</td>
            </tr>
        </table>`;
    layer.bindPopup(popupContent, { maxHeight: 400 }, { maxWidth: 500 });
  }


  //  pop_IPCommandArea3(feature, layer) {
  //   var popupContent = `<table>
  //       <tr>
  //         <th scope="row">Project Name</th>
  //         <td>` + (feature.properties['IS_Name'] !== null ? feature.properties['IS_Name'] : '') + `</td>
  //       </tr>
  //       <tr>
  //          <td colspan="2">` + (feature.properties['Ward_No_'] !== null ? feature.properties['Ward_No_'] : '') + `</td>
  //       </tr>
  //        <tr>
  //          <td colspan="2">` + (feature.properties['Programme'] !== null ? feature.properties['Programme'] : '') + `</td>
  //        </tr>
  //        <tr>
  //         <td colspan="2">` + (feature.properties['Funding'] !== null ? feature.properties['Funding'] : '') + `</td>
  //       </tr>
  //       <tr>
  //         <td colspan="2">` + (feature.properties['Stat_Ex_In'] !== null ? feature.properties['Stat_Ex_In'] : '') + `</td>
  //       </tr>
  //       <tr>
  //         <td colspan="2">` + (feature.properties['Src_Name'] !== null ? feature.properties['Src_Name'] : '') + `</td>
  //       </tr>
  //       <tr>
  //         <td colspan="2">` + (feature.properties['Src_Type'] !== null ? feature.properties['Src_Type'] : '') + `</td>
  //       </tr>
  //       <tr>
  //         <td colspan="2">` + (feature.properties['Abst_Type'] !== null ? feature.properties['Abst_Type'] : '') + `</td>
  //       </tr>
  //       <tr>
  //         <th scope="row">Current Status</th>
  //         <td colspan="2">` + (feature.properties['IS_Status'] !== null ? feature.properties['IS_Status'] : '') + `</td>
  //       </tr>
  //       <tr>
  //         <td colspan="2">` + (feature.properties['HW_East'] !== null ? feature.properties['HW_East'] : '') + `</td>
  //       </tr>
  //       <tr>
  //         <td colspan="2">` + (feature.properties['HW_North'] !== null ? feature.properties['HW_North'] : '') + `</td>
  //       </tr>
  //       <tr>
  //         <th scope="row">GCA</th>
  //         <td>` + (feature.properties['GCA'] !== null ? feature.properties['GCA'] : '') + `</td>
  //       </tr>
  //       <tr>
  //          <td colspan="2">` + (feature.properties['NCA'] !== null ? feature.properties['NCA'] : '') + `</td>
  //       </tr>
  //       <tr>
  //         <td colspan="2">` + (feature.properties['CA_Plan'] !== null ? feature.properties['CA_Plan'] : '') + `</td>
  //       </tr>
  //       <tr>
  //          <td colspan="2">` + (feature.properties['CA_Dev'] !== null ? feature.properties['CA_Dev'] : '') + `</td>
  //       </tr>
  //       <tr>
  //          <td colspan="2">` + (feature.properties['Q_lps__MC'] !== null ? feature.properties['Q_lps__MC'] : '') + `</td>
  //       </tr>
  //       <tr>
  //         <td colspan="2">` + (feature.properties['L_Km__MC'] !== null ? feature.properties['L_Km__MC'] : '') + `</td>
  //       </tr>
  //       <tr>
  //         <td colspan="2">` + (feature.properties['L_Km__Br'] !== null ? feature.properties['L_Km__Br'] : '') + `</td>
  //       </tr>
  //       <tr>
  //         <td colspan="2">` + (feature.properties['Crop_Sys'] !== null ? feature.properties['Crop_Sys'] : '') + `</td>
  //       </tr>
  //       <tr>
  //         <td colspan="2">` + (feature.properties['Crop_Win'] !== null ? feature.properties['Crop_Win'] : '') + `</td>
  //       </tr>
  //       <tr>
  //         <td colspan="2">` + (feature.properties['Crop_Spr'] !== null ? feature.properties['Crop_Spr'] : '') + `</td>
  //       </tr>
  //       <tr>
  //         <td colspan="2">` + (feature.properties['Crop_Mon'] !== null ? feature.properties['Crop_Mon'] : '') + `</td>
  //       </tr>
  //       <tr>
  //         <td colspan="2">` + (feature.properties['Can_Sys'] !== null ? feature.properties['Can_Sys'] : '') + `</td>
  //       </tr>
  //       <tr>
  //         <td colspan="2">` + (feature.properties['WUA_Reg'] !== null ? feature.properties['WUA_Reg'] : '') + `</td>
  //       </tr>
  //       <tr>
  //         <td colspan="2">` + (feature.properties['WUA_TO'] !== null ? feature.properties['WUA_TO'] : '') + `</td>
  //       </tr>
  //       <tr>
  //         <th scope="row">Irrigation Status</th>
  //         <td>` + (feature.properties['Irr_Status'] !== null ? feature.properties['Irr_Status'] : '') + `</td>
  //       </tr>
  //       <tr>
  //         <td colspan="2">` + (feature.properties['Irr_Cap_MS'] !== null ? feature.properties['Irr_Cap_MS'] : '') + `</td>
  //       </tr>
  //       <tr>
  //         <td colspan="2">` + (feature.properties['Irr_Cap_W_'] !== null ? feature.properties['Irr_Cap_W_'] : '') + `</td>
  //       </tr>
  //       <tr>
  //         <td colspan="2">` + (feature.properties['Irr_Cap_SP'] !== null ? feature.properties['Irr_Cap_SP'] : '') + `</td>
  //       </tr>
  //       <tr>
  //         <td colspan="2">` + (feature.properties['Irr_Cap_YR'] !== null ? feature.properties['Irr_Cap_YR'] : '') + `</td>
  //       </tr>
  //       <tr>
  //         <td colspan="2">` + (feature.properties['Dev_Int'] !== null ? feature.properties['Dev_Int'] : '') + `</td>
  //       </tr>
  //       <tr>
  //         <td colspan="2">` + (feature.properties['OBJECTID'] !== null ? feature.properties['OBJECTID'] : '') + `</td>
  //       </tr>
  //       <tr>
  //         <td colspan="2">` + (feature.properties['District'] !== null ? feature.properties['District'] : '') + `</td>
  //       </tr>
  //       <tr>
  //         <td colspan="2">` + (feature.properties['New_Area'] !== null ? feature.properties['New_Area'] : '') + `</td>
  //       </tr>
  //       <tr>
  //         <td colspan="2">` + (feature.properties['remarks'] !== null ? feature.properties['remarks'] : '') + `</td>
  //       </tr>
  //       <tr>
  //         <th scope="row">Pradesh</th>
  //         <td colspan="2">` + (feature.properties['State'] !== null ? feature.properties['State'] : '') + `</td>
  //       </tr>
  //     </table>`;
  //   layer.bindPopup(popupContent, {maxHeight: 400}, {maxWidth: 600});
  // }


  // working trial
  // onEachFeature(feature, layer) {

  // //	this.zone.run(() => {
  // 	  // push polygon names to regions array
  // 	 // this.regions.push(feature.properties.name);

  // 	  layer.on('click', <LeafletMouseEvent> (e) => {
  // 		this.zone.run(() => {
  // 		  this.clicked = e.target.feature.properties.District;
  // 		  layer.bindPopup(this.clicked.toString(), {maxHeight: 400});
  // 		  console.log(this.clicked);
  // 		});
  // 	  });
  // //	});

  //   }


  onMapReady(map: Map) {
    map.fitBounds([[25.081897222226793, 80.12665857438378], [31.35348213666765, 88.6768958255675]], {
      maxZoom: 12,

      animate: true
    });
    map.setMaxBounds(map.getBounds());
    map.setMinZoom(7);
  }

  apply() {

    // Get the active base layer
    this.baseUrl = AppConsts.remoteServiceBaseUrl;

    // Get all the active overlay layers
    const newLayers = this.model.overlayLayers
      .filter((l: any) => l.enabled)
      .map((l: any) => l.layer);
    const baseLayer = this.model.baseLayers.find((l: any) => (l.id === this.model.baseLayer));
    newLayers.unshift(baseLayer.layer);


    this.layers = newLayers;


    return false;
  }

  ngOnInit() {
    this.getDocumentsUploadedMaincanal();
  }

  isDocumentListTableLoading: boolean = false;
  UploadProjectInfoDocument() {
    let projectHelperDialog;
    projectHelperDialog = this._dialog.open(DocumentUploadComponent, {
      data: "3"
    });

    projectHelperDialog.afterClosed().subscribe(result => {
      if (result) {
        this.getDocumentsUploadedMaincanal();
      }
    });
  }

  DocumentsList: DocumentDto[] = [];
  getDocumentsUploadedMaincanal(): void {
    this.isDocumentListTableLoading = true;
    this.DocumentsList = [];
    this._documentServiceProxy.getDocumentListByProjectidAndDocType(this._commonService.getProjectid(), 3)
      .pipe(
        finalize(() => {
          this.isDocumentListTableLoading = false;
        })
      ).subscribe((result: ListResultDtoOfDocumentDto) => {
        // this.projects = result.items;
        this.DocumentsList = result.items;
        // console.log(this.DocumentsList)
      });
  }

}
