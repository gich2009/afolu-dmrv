d-MRV For AFOLU
Concept Note
June 2026
Prepared by: Kevin Kiptoo
Table of Contents
Executive Summary	1
1. Background and Strategic Context	2
1.1 The African AFOLU Carbon Opportunity	2
1.2 The Problem with Existing MRV Approaches	2
1.3 Verst Carbon’s dMRV Vision	3
2. Platform Architecture: The Three-Engine System	3
2.1 Measurement Engine	3
2.2 Carbon Accounting Engine	4
2.3 Compliance Engine	4
3. End-to-End Data Flow	5
4. Data Requirements by Project Stage	6
4.1 Comprehensive Dataset Register	6
4.2 Data Requirements by Project Stage	17
Stage 1: Onboarding	17
Stage 2: Baseline	17
Stage 3: Implementation / Activity Monitoring	18
Stage 4: Ongoing Monitoring	18
4.3 Carbon Pools	18
5. Biomass Modelling Approach	22
5.1 Space Intelligence Biomass Products	22
CarbonMapper™ - Satellite Above-Ground Biomass Density	23
Space Intelligence Portfolio Screening	23
5.2 Chloris Geospatial - Secondary AGBD Validation Layer	24
5.3 The Ideal Output: Iterative Site-Specific Accuracy	24
6. Methodology Framework	25
6.1 VM0048 - Avoided Unplanned Deforestation (REDD+)	25
6.2 Future Methodology Expansion	25
7. Technology Stack and Infrastructure	26
GEE Ingestion Layer - Data Pipeline Architecture	27
8. Phased Build Roadmap	28
Phase 1: MVP - Validate the Core Loop (Months 1–9)	28
Phase 2: Hybrid MRV and Smallholder Module (Months 9–18)	28
Phase 3: Compliance Intelligence and PDD Automation (Months 18–30)	28
9. Use Cases	29
10. Risk Assessment	30
11. Recommended Next Steps	31
12. Conclusion	32
13. Budget and Cost Considerations	33
Appendix A: Acronym Glossary	36
Appendix B: d-MRV Architecture	38
Appendix C: API	39

## Executive Summary
Africa's AFOLU landscapes represent one of the largest untapped pools of carbon sequestration potential in the world, yet the vast majority remain outside credible carbon markets because conventional Measurement, Reporting and Verification (MRV) is too costly, too inaccurate, and too slow for the fragmented smallholder landscapes that dominate the continent. Verst Carbon's response is a proprietary digital MRV (dMRV) platform that replaces manual field-centric MRV with a satellite-first, AI-assisted system purpose-built for African AFOLU project types. As the voluntary carbon market matures and standards bodies impose increasingly rigorous quantification requirements, the reliability and transparency of MRV processes have become the single greatest determinant of project credibility and commercial viability and this platform is Verst Carbon's answer to that challenge.
This concept note proposes the design and phased construction of a proprietary digital MRV (dMRV) platform purpose-built for AFOLU project types encompassing reforestation, afforestation, agroforestry, avoided deforestation (REDD+), and improved forest management across the African continent. The platform will serve as Verst Carbon’s internal infrastructure for carbon quantification, compliance evidence generation, and registry submission preparation.

[TABLE]
| Build in Phases The three-engine dMRV architecture is technically sound and well-sequenced. Combining Earth Observation with field-calibrated data is best-in-class for African AFOLU contexts and represents Verst Carbon’s primary technical market differentiator. The main discipline required is phasing and scope control: this is equivalent to building three specialist platforms simultaneously. |
[/TABLE]
The platform is structured around three core engines:
Measurement Engine - satellite and field-based carbon stock quantification using machine learning biomass models, GEDI LiDAR, SAR and optical imagery, and allometric calibration.
Carbon Accounting Engine - application of VM0048 and other approved methodologies to compute baselines, leakage, additionality, and net credit forecasts.
Compliance Engine - AI-assisted generation of additionality evidence packages, permanence risk scoring, FPIC document management, VVB-ready verification dossiers, and structured data handoff to Verst Carbon's AI PDD Generator for methodology-compliant PDD drafting.
The build is structured in three phases over 30 months, with Phase 1 targeting a working end-to-end MVP through a pilot AFOLU project in Kenya within 6–9 months. Key external data inputs include GEDIL4A data, Sentinel 2 and Landsat imagery processed through Google Earth Engine. Additional data and models might be sourced from other service providers such as Space Intelligence's HabitatMapper™ (10 m, >90% accuracy forest cover classification) and CarbonMapper™ (satellite AGBD) products, which are validated for Kenya under Verra VM0048.

## 1. Background and Strategic Context

## 1.1 The African AFOLU Carbon Opportunity
Sub-Saharan Africa holds some of the world’s most significant untapped carbon sequestration potential. Forest and land-use change account for approximately 10–15% of global greenhouse gas emissions, yet only a fraction of Africa’s eligible AFOLU landscape has been enrolled in credible, registry-approved carbon projects. Africa accounts for less than 10% of voluntary carbon market supply despite hosting over 30% of the world's tropical forest area, a structural mismatch driven almost entirely by the cost and complexity of rigorous MRV. Studies estimate that Africa's nature-based solution (NbS) potential could reach 2.5–4 GtCO₂e per year by 2030, yet less than 5% of that potential is currently monetised through credible carbon standards. Structural barriers, particularly the cost and complexity of rigorous MRV, have historically excluded smallholder-dominated landscapes and lower-resource project developers from the voluntary carbon market representing a significant unlocked commercial and climate opportunity.
Verst Carbon’s strategic mandate is to lower these barriers while maintaining the scientific and procedural integrity required by leading carbon standards, principally Verra’s Verified Carbon Standard (VCS) and the Gold Standard. A robust dMRV platform is essential to executing this mandate at scale.

## 1.2 The Problem with Existing MRV Approaches
Conventional MRV approaches for AFOLU projects rely on periodic field plot sampling with allometric equations and broad global biomass models to extrapolate carbon stocks. These approaches suffer from several critical limitations in the African context:
Global models have poor spatial resolution and biome specificity, generating high uncertainty in heterogeneous smallholder landscapes.
Low-confidence data cannot support the rigorous quantification required for GHG accounting or provide defensible evidence to Validation and Verification Bodies (VVBs).
The cost of sufficient field sampling is prohibitive at large scale, particularly across fragmented land tenure systems.
Temporal monitoring between verification events is sparse, leaving projects vulnerable to buffer pool challenges and reversal events.
Existing platforms are not purpose-built for African ecosystems, land tenure structures, or the connectivity constraints facing field teams.
VVBs and registries have historically been sceptical of satellite-derived biomass data as standalone evidence, requiring developers to produce costly supplementary field validation even where EO data quality is demonstrably high, creating an adoption barrier that dMRV must actively address through rigorous validation documentation and early VVB engagement.
Each of these failures maps directly to a dedicated engine in Verst Carbon's dMRV platform: the Measurement Engine addresses model accuracy and monitoring frequency through site-specific ML biomass models and continuous satellite ingestion; the Carbon Accounting Engine addresses compliance defensibility through rigorous, methodology-aligned additionality and baseline calculations; and the Compliance Engine addresses the cost and time burden of VVB submission through AI-assisted dossier assembly and gap identification. Taken together, the three engines are designed to make high-integrity MRV accessible and economical for the African AFOLU landscapes that conventional approaches have failed.

[TABLE]
| Core Insight A site-specific model, re-calibrated iteratively as new field, LiDAR, and drone data are acquired is necessary to generate the local accuracy and uncertainty quantification (UQ) required for high-integrity AFOLU carbon accounting. Global models are an inadequate substitute. |
[/TABLE]

## 1.3 Verst Carbon’s dMRV Vision
Verst Carbon’s dMRV platform will combine Earth Observation data processed through cloud-native geospatial infrastructure, field survey inputs collected via offline-capable mobile tools (such as KoboCollect, Survey 123), and AI-assisted compliance logic into a unified platform. The result is a system capable of producing:
Annual, pixel-level carbon stock maps with formal uncertainty quantification (Bayesian 95% credible intervals).
Defensible baseline, leakage, and additionality calculations aligned with approved AFOLU methodologies.
AI-flagged compliance gap assessments with human sign-off queues.
Structured PDD draft exports and VVB-ready verification dossiers.
A risk dashboard covering permanence, reversal risk, and leakage belt monitoring.

## 2. Platform Architecture: The Three-Engine System
The dMRV platform is structured around three interdependent engines that operate sequentially along the data processing pipeline. Each engine has a distinct functional mandate and together they answer three foundational questions of carbon project verification.

[TABLE]
| Engine | Core Question | Primary Outputs |
| 1. Measurement Engine | What is the carbon? | tCO₂e/pixel maps, carbon stock time series, biomass change detection |
| 2. Carbon Accounting Engine | What can be claimed? | Baseline scenarios, leakage calculations, net additionality, credit forecasts |
| 3. Compliance Engine | Will it pass VVB review? | Evidence packages, risk scores, FPIC records, structured PDD data package and AI PDD Generator (PDD draft), verification dossier |
[/TABLE]

## 2.1 Measurement Engine
The Measurement Engine is the scientific foundation of the platform. It ingests, preprocesses, and analyses multi-source Earth Observation data to produce carbon stock maps and biomass change signals for each enrolled project boundary. Its key functions include:
Earth Observation Ingestion: Sentinel-2 (multispectral), SAR (Sentinel-1), Landsat 8/9, GEDI spaceborne LiDAR, and Planet imagery are accessed via Google Earth Engine and commercial satellite APIs.
Preprocessing: Cloud masking, spatial projection alignment, and time-series normalisation prepare imagery for analysis.
Biomass Estimation via Machine Learning: Site-specific ML models (detailed in Section 5) estimate above-ground biomass density (AGBD) at 10m resolution with formal Bayesian uncertainty quantification.
Carbon Stock Mapping: AGBD estimates are converted to tCO₂e per pixel using standard biomass expansion factors and root-to-shoot ratios.
Change Detection: Gain and loss signals are computed year-on-year, enabling annual monitoring and early detection of disturbance or reversal events.
Baseline Reconstruction: Ten-year historical carbon stock time series are reconstructed per project boundary to support baseline setting.
The key scientific differentiator of the Measurement Engine is the Hybrid MRV capability: EO-derived carbon estimates are calibrated against field plot measurements using a regression framework, producing a validated tCO₂e dataset that combines the spatial coverage of satellite data with the ground-truth accuracy of field surveys. This hybrid approach is best-in-class for African AFOLU contexts where landscape heterogeneity limits the reliability of satellite-only estimates.

## 2.2 Carbon Accounting Engine
The Carbon Accounting Engine applies approved carbon accounting methodology logic to the validated measurement outputs to determine what carbon reductions and removals can be credited. For Phase 1, the anchor methodology is VM0048 (Avoided Unplanned Deforestation / REDD+). The engine performs:
Baseline Scenario Modelling: Historical deforestation rates within the Reference Region are computed using Space Intelligence's Forest Cover Benchmark Map for Kenya, which is Verra's official VM0048 data product for the jurisdiction (VT0007-compliant). The baseline is maintained dynamically each monitoring cycle by updating the Reference Region's historical deforestation rate against current Space Intelligence HabitatMapper™ land cover time series, ensuring the counterfactual reflects evolving deforestation pressure rather than a static projection locked at project inception.
Project Scenario Carbon Stock: Annual carbon stocks within the project boundary are computed from the Measurement Engine’s validated outputs across all applicable carbon pools (above-ground biomass, below-ground biomass, soil organic carbon, dead wood and litter).
Leakage Calculation: Activity-shifting leakage (displacement of deforestation pressure) is estimated using VM0048-specified approaches and EO-derived leakage belt monitoring via Space Intelligence's HabitatMapper™ annual land cover maps.
Net Additionality Calculation: Net GHG emission reductions and removals are computed as the difference between the dynamic baseline scenario and the project scenario, minus leakage with the baseline derived from live control plot monitoring rather than a static historical projection. With the baseline revised each monitoring cycle to reflect updated satellite observations and shifting deforestation pressure.
Credit Forecast with Confidence Intervals: Forward projections of creditable tonnes are generated with uncertainty bounds propagated from the Measurement Engine’s Bayesian outputs.
Phase 2 will introduce a multi-methodology abstraction layer, with VM0047 v1.1 (ARR) as the priority secondary methodology, to enable efficient addition of future approved methodologies.

## 2.3 Compliance Engine
The Compliance Engine ensures that the quantitative outputs of the platform are supported by the procedural and documentary evidence required by VVBs and registries. It provides:
Additionality Evidence Package: AI-assisted assembly of performance benchmark, investment analysis, and common practice evidence required under VM0048, with gap identification and a human sign-off queue.
Permanence and Reversal Risk Scoring: Automated risk scoring based on EO-detected disturbance signals, fire risk indices, land tenure data, and governance indicators.
Leakage Belt Monitoring: Continuous EO monitoring of the defined leakage belt surrounding each project to detect activity-shifting.
FPIC Document Management: Structured storage, completeness checking, and version control for Free, Prior and Informed Consent documentation from affected communities.
Benefit Sharing and Grievance Tracking: Logging and audit trail for community benefit sharing arrangements and grievance resolutions.
PDD Draft Export: Platform-computed carbon stock, baseline, additionality, and leakage values are passed directly into Verst Carbon's AI PDD Generator (verst.earth/ai-pdd-generator-https://aipdd-frontend-production.up.railway.app/), which uses large language models to auto-populate methodology-compliant PDD sections. This closes the data to documentation loop within the Verst toolchain, reducing PDD preparation from months to days and eliminating manual transcription errors.
Verification Dossier Builder: Compilation of all monitoring reports, field survey records, satellite analysis outputs, and procedural evidence into a structured VVB submission package.
Methodology Compliance Check: AI-driven, clause-by-clause validation of PDD content against VM0048 (and future methodologies) requirements, each gap is flagged with a direct citation to the specific methodology section, a plain-language description of what is missing, and a human sign-off queue for resolution before VVB submission.

## 3. End-to-End Data Flow
Data flows through the platform in seven sequential stages, from raw satellite and field data ingestion through to the final verified credit forecast and registry-ready documentation.

[TABLE]
| Stage | Description | Key Outputs |
| Ingest | Satellite imagery (Sentinel-2, Planet(commercial), Landsat via GEE), field surveys (KoboCollect/Survey 123), GEDI LiDAR, climate and soil data (iSDAsoil / SoilGrids) are ingested from authorised data sources. | Raw raster and vector datasets, field survey records |
| Preprocess | Cloud masking, spatial projection alignment, and time-series normalisation are applied to ensure data quality and consistency across sensors and acquisition dates. | Analysis-ready raster stacks, clean field datasets |
| EO engine | Site-specific ML models estimate above-ground biomass density at 10m resolution, generate carbon stock maps, and compute annual gain/loss signals. | AGBD maps (tCO₂e/pixel), uncertainty bands, change detection layers |
| MRV hybrid | EO carbon estimates are calibrated against field plot DBH/height measurements using allometric equations and regression, producing a validated tCO₂e dataset. | Validated carbon stock dataset — KEY DIFFERENTIATOR |
| Accounting | VM0048 methodology logic is applied: a dynamic baseline (maintained via permanent control plots monitored each cycle using the same satellite and field stack as the project area) is differenced against the project scenario; leakage and net additionality are computed; credit forecasts with Bayesian confidence intervals are generated. | Credit forecast, dynamic baseline scenario, leakage estimate |
| Compliance | AI flags compliance gaps, risk scores are computed, FPIC completeness is checked, and the human sign-off queue is populated for flagged items. | Risk dashboard, additionality evidence package, sign-off log |
| Output | Final outputs are compiled: verified credit forecast and risk dashboard are produced by the platform; the structured data package is passed to Verst Carbon's AI PDD Generator, which auto-populates the methodology-compliant PDD draft and Verra/Gold Standard-ready documentation package. | Credit forecast, risk dashboard; PDD draft (via AI PDD Generator), verification dossier, monitoring report |
[/TABLE]

## 4. Data Requirements by Project Stage
Data requirements vary significantly across the project lifecycle. The platform is designed to capture, store, validate, and process data at each of the four primary stages: Onboarding, Baseline, Implementation/Activity Monitoring, and Ongoing Monitoring.

## 4.1 Comprehensive Dataset Register
The table below is the master dataset register for the dMRV platform, covering every data input required across the Measurement, Carbon Accounting, and Compliance engines from initial project screening through to annual monitoring and VVB verification. Datasets are grouped by category. Source selection for individual projects is governed by data availability, connectivity, project scale, and the accuracy tier required for crediting.
Optical Satellite Imagery

[TABLE]
| Dataset / Product | Role in dMRV Platform | Provider / Source | Spatial Resolution | Temporal Coverage | Access |
| Sentinel-2 -Multispectral Instruments -MSI (ESA) | Primary optical predictor for AGBD and LULC classification. Spectral bands (NDVI, EVI, NBR, SWIR) feed directly into ML biomass models. Used for annual vegetation mapping, canopy greenness time series, and deforestation / regrowth detection. | ESA Copernicus / Google Earth Engine | 10 m (B2-B8); 20 m (B8A, B11, B12) | 2017–present; 5-day revisit | Free & open (GEE) |
| Landsat 8 & 9 – Operational Land Imagery - OLI (NASA/USGS) | Historical 10-year baseline reconstruction for LULC and deforestation trends. Enables pre-project carbon stock trajectory modelling. Archive from 1984 supports long VM0048 reference periods. | USGS Earth Explorer / GEE | 30 m | 1984–present; 16-day revisit (8-day combined L8+L9) | Free & open (GEE) |
| Planet PlanetScope | High-cadence optical monitoring for near-real-time activity verification, fine-scale disturbance detection (fire, illegal logging), and leakage belt surveillance at smallholder plot level. | Planet Labs API | 3–3.7 m | 2016–present; daily revisit | Commercial subscription |
| Vantor (formerly Maxar) WorldView-3 / WorldView-4 | Very high-resolution site verification. Used for boundary dispute resolution, fine-scale LULC classification, and reference imagery where 10 m resolution is insufficient for project boundary delineation. | Vantor (formerly Maxar) SecureWatch / commercial tasking | 0.3 m (pan); 1.24 m (MS) | On-demand tasking from 2014 | Commercial (per km² or subscription) |
[/TABLE]
Synthetic Aperture Radar (SAR) / Radar Satellite Data

[TABLE]
| Dataset / Product | Role in dMRV Platform | Provider / Source | Spatial Resolution | Temporal Coverage | Access |
| Sentinel-1 SAR (C-band, ESA) | SAR backscatter (VV/VH polarisations) as a biomass model predictor in cloud-prone tropical regions where optical data is limited. Penetrates cloud cover; essential for forest monitoring in humid zones. Also used in forest/non-forest change detection. | ESA Copernicus / GEE | 10 m (IW mode) | 2014–present; 6–12 day revisit | Free & open (GEE) |
| Advanced Land Observing Satellite 2 - ALOS-2 PALSAR-2 (L-band, JAXA) | L-band SAR penetrates forest canopy more deeply than C-band, giving stronger correlation with AGBD in dense tropical forests. Used as supplementary predictor in IB10 where available, and for baseline biomass estimation in high-biomass sites. | JAXA EORC / commercial licensing | 3–25 m (mode-dependent) | 2014–present; 14-day revisit | Commercial / research agreement |
[/TABLE]
Spaceborne LiDAR

[TABLE]
| Dataset / Product | Role in dMRV Platform | Provider / Source | Spatial Resolution | Temporal Coverage | Access |
| NASA GEDI L4A Monthly AGBD | Primary reference labels (training data) for AGBD models. Provides footprint-level AGBD estimates across tropical Africa. Used for annual biomass change detection and as cross-validation for EO-derived stock maps. Requires filtering to full-power beams and valid L2A quality flags. | NASA Earthdata / GEE | ~25 m footprint; ~600 m along-track spacing | April 2019–present (annual cadence) | Free & open (NASA Earthdata) |
| NASA GEDI L2A Canopy Height (RH metrics) | Canopy height and vertical structure profiles for biomass model validation. Cross-validated against Chloris AGBD change metrics. Useful for detecting growing plantations and forest degradation (r = 0.76 with Chloris change, per 2026 validation). | NASA Earthdata / GEE | ~25 m footprint | April 2019–present | Free & open (NASA Earthdata) |
[/TABLE]
Airborne & Drone LiDAR

[TABLE]
| Dataset / Product | Role in dMRV Platform | Provider / Source | Spatial Resolution | Temporal Coverage | Access |
| Airborne Laser Scanning (ALS) | Highest-accuracy canopy height and biomass reference data. Primary input label for IB10 site-specific Bayesian model calibration, replacing GEDI where higher-density ground truth is needed. Enables sub-metre canopy structure characterisation for validation of satellite biomass estimates. | Commercial ALS providers (AAM, Woolpert, etc.); national survey agencies | 0.1–0.5 m point cloud; products at 1 m | Project-specific; episodic (baseline + periodic re-flights) | Commercial (per-flight contract) |
| Drone / UAV LiDAR | Site-level canopy height model (CHM) for IB10 model calibration and QA. Cost-effective for smaller areas where full ALS is not justified. | In-house drone operations or local contractors; sensors: DJI Zenmuse L2, Riegl miniVUX | 0.05–0.2 m point cloud | On-demand; baseline + 3–5 year intervals or as triggered by QA | In-house / commercial |
[/TABLE]
Derived Biomass Products (Space Intelligence & Chloris Geospatial)

[TABLE]
| Dataset / Product | Role in dMRV Platform | Provider / Source | Spatial Resolution | Temporal Coverage | Access |
| Space Intelligence HabitatMapper™ — Forest Cover & Land Use Classification | Primary forest cover and land use classification product for VM0048 baseline construction. HabitatMapper™ delivers 10 m land cover at >90% accuracy; follows VT0007 to produce the Forest Cover Benchmark Map and deforestation risk map for REDD+ projects. Official Verra data provider for Kenya under VM0048. Recommended for Phases 1+ of platform. | Space Intelligence API | 10 m (HabitatMapper™) | Current year + previous 10 years; annual cadence | Commercial API |
| Space Intelligence CarbonMapper™ — AGBD Time Series | Satellite-derived AGBD product for Phase 1 baseline construction and historical biomass time series reconstruction. Used alongside HabitatMapper™ for carbon stock quantification. Provides wall-to-wall AGBD coverage for VM0048 reference region analysis. | Space Intelligence API | 10 m (CarbonMapper™) | 2017–present; annual cadence | Commercial API |
| Space Intelligence Portfolio Screening | Rapid project screening and portfolio-level feasibility assessment using Space Intelligence's coarser-resolution data products. Suitable for initial scoping before committing to full HabitatMapper™/CarbonMapper™ project delivery. For mangrove projects, Space Intelligence Proposal 2 ($6,990) covers Kisite-Mpunguti under VM0007/VM0033. | Space Intelligence API | ≈ 30–100 m (portfolio screening) | Static map, most recent complete year; trained on 2019–2023 data | Commercial API |
| Chloris Geospatial AGBD Product | Independent annual AGBD validation and cross-check layer. Used to cross-validate Space Intelligence CarbonMapper™ outputs; provides secondary leakage belt biomass change signal; supports 10-year historical reconstruction. Not the primary provider for Kenya VM0048 projects. Validated R² = 0.74–0.92 across tropical and temperate biomes (2026 white paper). | Chloris Geospatial API | ~10–30 m (Sentinel-2 based) | Annual 2000–present | Commercial API |
[/TABLE]
Elevation & Topographic Data

[TABLE]
| Dataset / Product | Role in dMRV Platform | Provider / Source | Spatial Resolution | Temporal Coverage | Access |
| Copernicus GLO-30 DEM | Primary topographic predictor in all biomass ML models (IB10, SB10, SB100). Slope, aspect, and elevation features account for topographic control on biomass distribution and are used in SAR terrain normalisation. | Copernicus Land Service / GEE | 30 m (~1 arc-second) | Static reference (2011 collection period) | Free & open |
| SRTM DEM (NASA/NGA) | Backup DEM for topographic features where Copernicus GLO-30 is unavailable, and for historical analyses pre-2011. Used in allometric height correction functions. | NASA Earthdata / GEE | 30 m (1 arc-second global); 90 m (3 arc-second outside US) | Static reference (February 2000 acquisition) | Free & open (GEE) |
[/TABLE]
Land Use / Land Cover & Forest Change Products

[TABLE]
| Dataset / Product | Role in dMRV Platform | Provider / Source | Spatial Resolution | Temporal Coverage | Access |
| ESA WorldCover | Global land cover classification for biomass model stratification and ecoregion-adjusted modelling. Defines forest, shrubland, cropland, and grassland strata for baseline LULC composition. Used in project eligibility screening. | ESA / GEE | 10 m | Annual, 2020–present | Free & open |
| Hansen Global Forest Change (GFC) | Annual tree cover loss and gain from 2000 to present. Primary input for baseline deforestation rate computation under VM0048 reference region approach. Used to construct historical forest cover trajectory for additionality demonstration. | University of Maryland / GEE | 30 m | 2000–present; annual updates | Free & open (GEE) |
| Global Forest Watch GLAD / RADD Alerts | Near-real-time forest loss alerts for continuous leakage belt monitoring and early detection of reversal events inside the project boundary. Triggers automated platform alert and human review queue. | World Resources Institute / GFW API | 30 m | Weekly alerts (GLAD); 2015–present | Free & open (GFW API) |
| RESOLVE Ecoregions 2017 | Ecological regionalisation layer for stratification in Space Intelligence HabitatMapper™/CarbonMapper™ models and for biome-appropriate allometric equation selection. | RESOLVE Biodiversity & Wildlife / GEE | Vector polygons (~1–10 km² per ecoregion) | Static (2017 reference) | Free & open |
| ESA CCI Land Cover (Africa) | Annual continental LULC time series for historical baseline reconstruction across African AFOLU projects. Covers land cover transitions (forest gain/loss, agricultural expansion) for reference area deforestation analysis. | ESA Climate Change Initiative / GEE | 300 m | 1992–2020; annual | Free & open |
[/TABLE]
Soil & Carbon Data

[TABLE]
| Dataset / Product | Role in dMRV Platform | Provider / Source | Spatial Resolution | Temporal Coverage | Access |
| SoilGrids 250m v2.0 (ISRIC) | Soil organic carbon (SOC) stock estimates (t C/ha) for below-ground carbon pool quantification in baseline and project scenarios. Also provides soil texture, bulk density, and pH as covariates in biomass models. | ISRIC World Soil Information / REST API | 250 m | Static reference (2021 vintage); updated periodically | Free & open (REST API) |
| SoilCarbon.Africa (AfSIS) | Africa-specific soil carbon training dataset. Where available, provides higher-accuracy SOC estimates calibrated to African soils, replacing global SoilGrids defaults for project SOC baseline quantification. | African Soil Information Service (AfSIS) / CIMMYT | 1 km (variable by region) | Static (various collection periods) | Open access (project registration required) |
| iSDAsoil (iSDA / OpenGeoHub) | Africa-specific SOC, pH, bulk density, texture at 30 m — highest-resolution continental soil product. Preferred over SoilGrids for African project sites; used as a below-ground carbon covariate and soil baseline input. Per-pixel uncertainty maps included. | iSDA / OpenGeoHub / CIFOR-ICRAF | 30 m | Static (2001–2017 training period); full Africa coverage | Free & open — REST API (api.isda-africa.com) + GEE (ISDASOIL/Africa/v1) |
[/TABLE]
Climate & Meteorological Data

[TABLE]
| Dataset / Product | Role in dMRV Platform | Provider / Source | Spatial Resolution | Temporal Coverage | Access |
| CHIRPS v2.0 Rainfall (UCSB) | Rainfall predictor in biomass ML models; drought stress proxy for permanence risk scoring. Annual precipitation anomalies used to contextualise biomass change signals and distinguish drought-induced dieback from anthropogenic deforestation. | UCSB Climate Hazards Center / GEE | 5 km (~0.05°) | 1981–present; daily, monthly, annual | Free & open (GEE) |
| ERA5 Reanalysis (ECMWF / Copernicus) | Temperature, vapour pressure deficit, solar radiation, and humidity as biomass model predictors and climate risk assessment inputs. Used in site-level climate characterisation for PDD documentation and baseline climate context. | ECMWF Copernicus CDS / GEE | 31 km (~0.25°) | 1979–present; hourly to monthly | Free & open (CDS / GEE) |
| MODIS Active Fire & Burned Area (NASA) | Land surface temperature anomaly as drought/heat stress proxy. MODIS active fire product (MOD14A1) and burned area (MCD64A1) used for fire disturbance detection and reversal risk assessment in permanence scoring and VVB evidence packages. | NASA Earthdata / GEE | 500 m – 1 km (product-dependent) | 2000–present; daily to annual composites | Free & open (GEE) |
| WorldClim v2.1 (Bioclimatic Variables) | 19 bioclimatic variables (BIO1–BIO19) used as static covariates in allometric model calibration and biomass ML model training. BIO1 (mean annual temperature) and BIO12 (annual precipitation) cited in PDD climate zone characterisation and baseline context documentation. Not used for anomaly detection or near-real-time monitoring (static normals product). | WorldClim.org / GEE (WORLDCLIM/V1/BIO) | ~1 km (30 arc-sec) | Static normals 1970–2000 | Free & open (direct download / GEE) |
[/TABLE]
Deep Learning Feature Inputs

[TABLE]
| Dataset / Product | Role in dMRV Platform | Provider / Source | Spatial Resolution | Temporal Coverage | Access |
| Google Satellite Embeddings V1 Annual | Pre-trained deep learning feature embeddings derived from global satellite imagery. Primary high-dimensional predictor in Space Intelligence CarbonMapper™ and HabitatMapper™ models. Encodes rich texture, spectral, and structural information that exceeds what raw band values can provide, enabling locally adaptive biomass mapping. | Google / accessed via Space Intelligence API | ~10 m equivalent (embedding tile resolution) | Annual mosaics; 2017–present | Via Space Intelligence API (commercial) |
[/TABLE]
Vendor Independence Pathway (Phase 2–3): The current reliance on Google Satellite Embeddings V1 accessed via the Space Intelligence API is appropriate for Phase 1 given the absence of large, labelled training datasets from African woodland sites. As field calibration data accumulates across early projects, Verst should evaluate fine-tuning an open-weight geospatial foundation model such as NASA/IBM Prithvi (pretrained on Harmonized Landsat-Sentinel-2, Apache 2.0 licence) or SatMAE++ on its own labelled plot data. This would produce Africa-specific embeddings better calibrated to the woodland and savanna biomass ranges relevant to Verst's project portfolio, while eliminating the Space Intelligence API cost and vendor lock-in at scale. Target: internal embedding pipeline operational by end of Phase 3 (Month 30).
Field-Collected Data

[TABLE]
| Dataset / Product | Role in dMRV Platform | Collection Tool / Method | Measurement Level / Resolution | Collection Frequency | Responsible Party |
| GPS project boundary (GeoJSON polygon/kml/shapefiles) | Defines precise project boundary for all EO clipping, accounting, and compliance workflows. Used in registry PDD and eligibility area calculation. | GPS devices; FieldMaps; Avenza Maps; KoboCollect with GNSS | Parcel / project boundary (cm–m GNSS accuracy) | At project inception; updated on boundary changes | Project proposer / Verst field team |
| Field plot DBH (Diameter at Breast Height) | AGB estimation via locally-calibrated allometric equations. Primary ground-truth labels for IB10 Bayesian model. Enables replacement of global IPCC Tier 1 defaults with site-specific allometrics to reduce uncertainty. | KoboCollect, Survey123 / ArcGIS Field Maps; DBH tapes; dendrometers | Individual tree level (mm precision); permanent monitoring plots | Baseline; annual remeasurement | Verst / project developer field team |
| Field plot tree height measurements | Tree height for biomass allometric equations; canopy height validation for GEDI and drone LiDAR; inputs to volume and biomass computation. | KoboCollect, Survey123; hypsometers / clinometers / Vertex instruments | Individual tree level (0.1 m precision) | Baseline; annual remeasurement | Verst / project developer field team |
| Field plot species identification | Species-specific allometric equation selection. Biodiversity co-benefit baseline. Species composition required in PDD documentation. | KoboCollect, Survey123 with photo ID; herbarium reference; iNaturalist | Individual tree / plot level | Baseline; annual monitoring | Botanist / trained enumerator |
| Soil organic carbon core samples | Site-specific SOC quantification where iSDAsoil or SoilGrids remote estimates are insufficient. Required for projects claiming SOC as an additional carbon pool. Replaces global defaults with local measurements. | Soil coring equipment; lab analysis (loss-on-ignition / Walkley-Black); GPS georeferencing | Point samples per plot; composite cores to 30 cm, 50 cm, 100 cm depths | Baseline; every 5 years (or per methodology requirements) | Soil scientist / project developer |
| Planting and nursery operations records | Project activity verification for conformance against approved PDD activity plan. Required for additionality evidence (implementation barrier). Feeds project GHG emissions accounting (fuel, fertiliser, herbicide). | KoboCollect (offline-first); ArcGIS Field Maps | Individual farm/plot level with GPS coordinates | Daily during establishment; weekly during maintenance | Field operations team |
| Tree survival and mortality monitoring | Activity monitoring KPIs: survival rate (%); mortality rate (%); missed targets; SOP conformance. Required for periodic monitoring reports and VVB review. | KoboCollect; ArcGIS Field Maps | Individual farm/plot level | Monthly (post-establishment for first 2 years); quarterly thereafter | Project developer field team |
| Transportation and fuel use records | Project GHG emissions computation (Scope 1 fuel combustion; Scope 2 electricity). Required under VM0048 project emissions accounting to derive net GHG removals. | KoboCollect; manual logbooks; fleet management systems | Per vehicle trip (fuel volume, distance, vehicle weight) | Per trip / daily during active operations | Project operations manager |
| FPIC documentation records | Free, Prior and Informed Consent evidence required for all AFOLU projects affecting indigenous or local communities under Verra AFOLU requirements. Completeness checking automated in Compliance Engine. | Document management system; structured digital forms; KoboCollect consent signatures | Community level (per affected community) | At project inception; updated on significant project changes | Community liaison / legal team |
| Bioacoustics recordings (bird diversity) | Bird species richness and diversity indices for biodiversity co-benefit reporting and potential nature credit stacking. | AudioMoth or Song Meter bioacoustic recorders; automated ID via BirdNET AI | Site-level grid sampling (per monitoring plot station) | Annual (48–72 hour continuous recordings per station) | Biodiversity field team |
| Camera trap imagery (large mammals) | Mammal presence/absence and occupancy rates for biodiversity co-benefit reporting. Supports IUCN Red List species documentation. | Camera traps (Bushnell, Browning) with GPS coordinates | Site-level (per camera station) | Continuous capture; annual data compilation and analysis | Biodiversity field team |
| Vegetation density surveys (understory) | Understory species composition and density for biodiversity co-benefit baseline. Required where projects include biodiversity metrics in the benefit statement. | Botanist-led quadrat surveys; KoboCollect for species recording | Plot-level quadrats (1 m² to 100 m² depending on vegetation type) | Annual | Botanist / trained field enumerator |
| Pitfall trap insect samples | Insect diversity index as ecosystem health co-benefit indicator (ground beetle community composition as proxy). | Standard pitfall traps (NLBIF protocol); laboratory taxonomic identification | Plot-level sampling arrays | Seasonal (wet and dry season) | Biodiversity field team / entomologist |
[/TABLE]

## 4.2 Data Requirements by Project Stage

## Stage 1: Onboarding
At onboarding, sufficient data is collected to define the project boundary, classify the intervention type, and initiate the baseline reconstruction pipeline.
Project area polygon (kml/shapefile/GeoJSON boundary of the project site)
Project name, type (reforestation, agroforestry, avoided deforestation), and crediting period start date
Proposed crediting period duration
Responsible entity and contact information
Initial LULC classification of the project area
Tools: GPS-enabled smartphones with GIS data collection apps (Survey123, ArcGIS Field Maps, Avenza, KoboCollect); boundary ingestion via platform API.

## Stage 2: Baseline
The baseline stage establishes the counterfactual carbon trajectory against which the project’s additionality is measured. Data requirements include:
LULC classification - historical LULC maps covering the 10-year lookback period
Historical deforestation rates - derived from EO analysis (Landsat / Sentinel time series) and cross-validated with Hansen Global Forest Change data
Carbon stock / biomass baseline - initial above-ground biomass (AGB) estimate using satellite biomass models (SB100 or SB10), with field plot calibration (DBH and height measurements) to improve accuracy
Soil organic carbon - extracted from iSDAsoil (30 m, Africa-specific) as primary source; SoilGrids 250m as global fallback where iSDAsoil coverage is insufficient
Biodiversity baseline - species occurrence data where available (GBIF, iNaturalist); bioacoustics monitoring for birds; vegetation density surveys
Tools: Satellite imagery via Google Earth Engine; field DBH and height collected with KoboCollect, Survey123 or ArcGIS Field Maps; allometric equations applied within the platform to convert measurements to carbon.

## Stage 3: Implementation / Activity Monitoring
During project implementation, the platform captures operational data to verify that activities conform to the approved project design and to compute emissions associated with project activities (e.g., fuel use, transport).
Field Operations Data (Daily/Weekly): Date, farm/plot ID, collector name, activity category (establishment, maintenance), activity type (line slashing, casing, spraying, watering, fire patrol), PPE compliance, safety talks, injuries recorded, observed deforestation.
Planting Data: Species name, number of seedlings planted, number of workers (gender-disaggregated), hectares of activity completed, location (GPS coordinates), hydrogel/fertiliser/herbicide quantities used.
Nursery Details: Seedling numbers, seed quantities, workers involved.
Transportation / Emissions Data: Fuel/electricity consumed (kWh), distance travelled, vehicle weight, fuel emission factors (kg CO₂ per litre/tonne).
Biodiversity Monitoring: Bird species via bioacoustics; insect diversity via pitfall traps; vegetation density surveys (botanist-led); large mammal presence via camera traps; annual species counts.
Tools: ArcGIS Field Maps, KoboCollect, Survey123; soil carbon sensors; dendrometers; bioacoustic recording devices.

## Stage 4: Ongoing Monitoring
Ongoing monitoring generates the annual data required for carbon accounting and VVB verification. It comprises two sub-streams:
Activity Monitoring (Monthly): Tree survival rate (%), mortality rate (%), missed planting targets, SOP conformance, personnel monitoring records.
Biomass Monitoring (Annual): DBH and height re-measurements from permanent monitoring plots; volume and biomass estimates updated via allometric equations; EO-derived biomass change detection (Space Intelligence CarbonMapper™ annual refresh or HabitatMapper™ annual update).
Tools: KoboCollect, ArcGIS Field Maps and remote sensing for biomass monitoring; project developer field teams for activity monitoring.

## 4.3 Carbon Pools
The platform is designed to quantify all four carbon pools recognised under AFOLU carbon standards, with the level of precision increasing as more field data is integrated:
Above-ground biomass (AGB) - primary pool; quantified via hybrid EO and field approach
AGB is the primary carbon pool and the foundation for all other pool estimates. It is quantified through a hybrid approach combining satellite Earth observation with field-based allometric measurements, with accuracy increasing as more site-specific data is integrated across the project lifecycle.
Step 1 - Satellite-only baseline (Phase 1). At project onboarding, AGB is estimated at 10m resolution from multi-temporal Sentinel-2 optical imagery and Sentinel-1 SAR backscatter without requiring field visits, and is appropriate for site screening and initial baseline construction. Uncertainty at this tier is typically ±25–40% depending on vegetation density and cloud cover.
Preferred path (subject to commercial agreement): Space Intelligence's HabitatMapper™ and CarbonMapper™ process the GEE-exported raster stack to produce forest cover classifications and pixel-level AGBD estimates. These products benefit from Space Intelligence's validated training data for Kenya and are the official Verra-accredited data source for VM0048 in this jurisdiction.
Fallback path: AGB is estimated using the Lang et al. (2023) Global Canopy Height Model (10m, free via GEE), combined with the Chloris Geospatial AGBD product (30m, API-accessible) as a cross-check, and published allometric regression equations (Feldpausch et al. 2012 for African savannahs; Chave et al. 2014 pantropical). This path requires no proprietary API, is fully auditable, and produces Tier 2-equivalent estimates sufficient for site screening and Phase 1 baseline construction. Uncertainty is comparable to SB100 (±30–45%).
Step 2 - Field-calibrated hybrid model (Phase 2 onwards). Once field crews collect plot-level data (DBH, height, species, crown area), these measurements are converted to AGB via species-specific allometric equations (pantropical equations from Chave et al. 2014 by default; regional African equations where available). The resulting per-plot AGB values are used to calibrate the model in Phase 1 to an integrated biomass model, fitting a site-specific regression between allometric AGB and the satellite-derived spectral/structural signal. This reduces uncertainty to ±10–20% and produces a locally validated AGB raster for the full project area at 10m resolution.
Step 3 - Temporal change detection. Across monitoring cycles, AGB change is detected by differencing consecutive annual AGB rasters, informed by Sentinel-2 time series, Hansen Global Forest Change data (30m), and GEDI LiDAR canopy height composites where available. Change events flagged as statistically significant (>2σ from expected growth trajectory) trigger a field verification workflow in the Compliance Engine. This supports both permanence verification and early detection of reversal events.
Step 4 - Uncertainty reporting. The Accounting Engine propagates AGB uncertainty through to the final credit forecast using a conservative approach: the lower bound of the 90% confidence interval of the AGB estimate is used as the project AGB value for credit issuance, consistent with VM0048 section 5.3. This systematic deduction from the central estimate buffers against over-crediting without requiring Monte Carlo simulation at Phase 1.
Platform implementation: Sentinel-2, Sentinel-1, and ancillary EO layers (GEDI, Hansen GFC, iSDAsoil, CHIRPS) are ingested via Google Earth Engine (GEE). GEE handles cloud masking, time-series normalisation, and spatial projection alignment server-side, exporting analysis-ready raster stacks to a Google Cloud Storage (GCS) bucket. A Cloud Run trigger fires on each new export, passing the stacks to: (a) the Space Intelligence API if a commercial agreement is in place (preferred Phase 1 path — Proposal 1: $25k for Tsavo/Meru/Kora; Proposal 2: $6,990 for Kisite-Mpunguti), or (b) a fallback inference endpoint running the Lang canopy height + Chloris AGBD + allometric regression pipeline (zero marginal API cost, activated automatically if the Space Intelligence endpoint is unreachable or not yet contracted), or (c) the internal ML pipeline from Phase 2–3 onwards. AGB outputs are stored as georeferenced raster stacks (GeoTIFF, EPSG:4326) per monitoring period, with mean, lower CI, and upper CI as separate bands. The Accounting Engine ingests these directly; no manual AGB entry is required. AGB is the single most important input to the entire credit calculation chain, investment in field calibration to reach IB10 tier should be prioritised from the first monitoring cycle.
Below-ground biomass (BGB) - derived from AGB using root-to-shoot ratios per IPCC Tier 1 defaults or localised calibration
BGB cannot be measured directly at scale and is always derived from above-ground biomass (AGB) estimates. The quality of the BGB figure is therefore capped entirely by the quality of the AGB output from the Measurement Engine. The platform estimates BGB in three sequential steps:
Step 1 - AGB input. The hybrid EO + field AGB estimate (tCO₂e/ha) for each pixel or plot is taken as the direct input. At project onboarding, this will typically be the Space Intelligence CarbonMapper™ satellite AGBD output; from Phase 2 onwards, the field-calibrated integrated model output is used, materially reducing the input uncertainty.
Step 2 - Root-to-shoot (R:S) ratio selection. The platform applies an R:S ratio by land class, defaulting to IPCC 2006 Guidelines Table 4.4 values:\n• Tropical moist forest: R:S ≈ 0.37\n• Tropical dry forest / woodland (miombo, savanna): R:S ≈ 0.45–0.65 (fire-adapted species invest heavily in root reserves) \n• Grassland / shrubland: R:S ≈ 0.46\n. These are the Tier 1 defaults required by VM0048 unless a peer-reviewed, localised R:S value for the specific species mix and biome is available. From Phase 2, the platform will allow per-project R:S overrides where localised allometric studies exist, with the source citation recorded in the project audit trail.
Step 3 - Calculation and uncertainty propagation. BGB is computed pixel-by-pixel as: BGB = AGB × R:S. BGB uncertainty compounds from AGB uncertainty and R:S uncertainty. At Tier 1 (IPCC defaults), R:S uncertainty is approximately ±30%; this is propagated through to the final BGB confidence interval reported in the credit forecast. VM0048 requires BGB to be reported as a separate pool with its own uncertainty bound - the Accounting Engine outputs this as a distinct layer alongside AGB in the carbon stock map stack. Where localised R:S values are used, the associated peer-reviewed uncertainty range replaces the IPCC default.
BGB estimation is a deterministic calculation within the Accounting Engine, not a measurement or ML inference step. The R:S lookup table (keyed by FAO land cover class and IPCC climate zone) is maintained as a versioned parameter file, ensuring reproducibility across monitoring cycles. Localised R:S overrides require a project-level data entry with citation and are flagged for VVB reviewer attention in the compliance dossier. Destructive root sampling to validate or replace the IPCC default is recommended for high-value projects (>50,000 tCO₂e/yr) from Phase 2 onwards.
Soil organic carbon (SOC) - primary source: iSDAsoil at 30 m (Africa-specific); fallback: SoilGrids 250m; both updated where field soil sampling is conducted
SOC is a mandatory AFOLU carbon pool under VM0048 for project types that affect soil carbon stocks (notably ARR and improved land management). For most ARR projects, SOC change over the crediting period is expected to be modest relative to AGB accumulation, but it must be measured, reported, and verified. The platform handles SOC in three tiers of increasing precision.
Tier 1 - Remote sensing baseline (Phase 1). iSDAsoil (Africa-specific, 30 m resolution) is used as the primary source for initial SOC stock mapping across the project area. It provides SOC content (g/kg) and bulk density at three depth intervals (0–20 cm, 20–50 cm) with per-pixel uncertainty estimates. These are combined with plot area data to compute SOC stocks in tCO₂e/ha using the standard formula: SOC stock = SOC content × bulk density × layer thickness × (1 − coarse fragment fraction) × 44/12. Where iSDAsoil confidence is low (flagged in its uncertainty layer), SoilGrids 250 m values are used as a fallback.
Tier 2 - Field soil sampling (Phase 2 onwards). Soil cores are collected at stratified random sample points (minimum density per VM0048 section 6.4: one core per 10–50 ha depending on spatial variability) at 0–30 cm depth and submitted for laboratory analysis (Loss-on-Ignition or Walkley-Black method; recommended labs with African capacity include CropNut and ICRAF/CIMMYT's soil laboratory network). Lab results update the site-specific SOC model, replacing the iSDAsoil prior for the sampled stratum. Bulk density is measured in-field using the core method. This field-updated layer feeds directly into the Accounting Engine and is stored as a versioned project data layer.
Tier 3 - Temporal SOC change monitoring. SOC stocks are expected to increase gradually as vegetation cover improves (typically 0.1–0.5 tC/ha/yr for African ARR sites). OpenLandMap-soildb's 2000–2022 time series (30 m, GEE) provides a pre-project trajectory to detect trends, but its 5-year temporal resolution means it cannot substitute for field-measured annual change. The platform therefore schedules re-sampling of permanent soil plots every five years, with the Accounting Engine computing SOC change as the difference in mean stock between monitoring events, adjusted for bulk density and sampling depth consistency.
Uncertainty and conservativeness. SOC uncertainty is high relative to AGB, typical CV for field-measured SOC is 30–60% due to soil spatial variability. The platform applies the IPCC Tier 1 conservative discount (applying the lower confidence bound for credit issuance) unless a project-level variogram analysis justifies a tighter uncertainty estimate. All SOC credits are netted against baseline SOC to ensure only additionality is claimed.
Platform implementation: SOC is computed in the Accounting Engine as a separate carbon pool layer, not aggregated with AGB. Field sampling data is ingested via a structured KoboCollect form template (pre-configured for VM0048 SOC sampling protocol) and linked to spatial plot coordinates. The platform flags any project area where the iSDAsoil uncertainty layer exceeds a threshold (>40% CV) for priority field sampling in the next monitoring cycle.
Dead wood and litter - estimated using IPCC default fractions or site-specific measurements where project type warrants inclusion
Dead wood and litter are secondary carbon pools under VM0048. They are often excluded from ARR project accounting at Phase 1 (VM0047 section 3.2 permits exclusion of pools that are not a significant source), but including them as project pools, rather than treating them as zero, can add meaningful credits in woodland and savanna contexts where deadwood stocks are substantial.
Dead wood includes standing dead trees (snags), fallen coarse woody debris (CWD, diameter ≥10 cm), and stumps. Carbon content is estimated using the same allometric framework as AGB: volume is measured in the field (using line-intercept method for CWD, standard diameter/height measurements for snags) and converted to biomass via decay class-specific wood density values (IPCC Table 4.3), then to carbon using a default fraction of 0.47 tC/t biomass. Decay class assignment (Classes I–V) is performed by trained field crews, as it governs wood density and hence the carbon content estimate.
Litter comprises fine woody debris (<10 cm diameter), fallen leaves, and surface organic matter above the mineral soil. It is sampled using the IPCC Tier 2 method: litter is collected from fixed-area quadrats (0.5 × 0.5 m, minimum 4 per plot), oven-dried, weighed, and a sub-sample sent for carbon analysis (or default fraction of 0.37 tC/t dry mass used). In African savanna and dry woodland systems, litter stocks are highly seasonal and spatially variable. Sampling should be conducted consistently at the same phenological stage across monitoring periods.
IPCC default approach (Phase 1 fallback). Where field measurement of dead wood and litter is not feasible at baseline, the platform applies the IPCC Tier 1 approach: dead wood stock is estimated as a fixed fraction of AGB (typically 11% for tropical moist forest, 6% for tropical dry / woodland - IPCC 2006 Table 4.4), and litter as a separate fraction (3–5% of AGB). These fractions are applied to the AGB raster to generate a pool-level carbon estimate. This approach is conservative and VVB-acceptable at Phase 1 but should be replaced with field measurements from Phase 2 onwards for high-value projects.
African AFOLU contexts, dead wood and litter pools carry significant fire and decomposition reversal risk. The Compliance Engine monitors fire occurrence within project boundaries using MODIS/VIIRS active fire data and burned area products (MCD64A1). A fire event triggers an automatic pool reduction calculation: the affected area's dead wood and litter pools are partially or fully zeroed depending on burn severity, with the deduction applied to the net credit calculation in that monitoring period. This prevents over-crediting when fire consumes carbon that was previously claimed.
Dead wood and litter are tracked as two separate sub-pools in the Accounting Engine, each with their own stock raster and uncertainty layer. Field data is collected via KoboCollect and/or using Survey 123 or any other field data collection app using a dedicated dead wood / litter form template (line-intercept transect for CWD, quadrat sampling for litter). Decay class photos are captured in-app for remote QA review. Projects electing to exclude these pools at Phase 1 are flagged in the compliance module, and the exclusion is automatically re-evaluated at each monitoring period against the significance threshold inclusion becomes mandatory if modelled stocks exceed 10% of total project carbon.

## 5. Biomass Modelling Approach
Accurate above-ground biomass density (AGBD) estimation is the scientific core of the dMRV platform. The platform adopts a tiered modelling approach, with the choice of model determined by data availability, project scale, and the accuracy tier required for crediting. The platform is designed to integrate Space Intelligence’s HabitatMapper™ and CarbonMapper™ as its primary external biomass data providers, with Chloris Geospatial retained as a secondary cross-validation layer (subject to commercial terms agreement with both parties).

## 5.1 Space Intelligence Biomass Products
Space Intelligence provides two primary data products for forest carbon MRV, validated for Kenya under Verra VM0048. The platform will integrate both via API. Note: Space Intelligence runs its geospatial AI/ML pipelines on Microsoft Planetary Computer Pro (now Generally Available, June 2026), an enterprise Azure service for large-scale EO data ingestion, cataloguing, and GeoAI processing. This infrastructure underpins the audit-grade data quality of Space Intelligence's products and is relevant context when evaluating the long-term data partnership (see also Section 7).
HabitatMapper™ - Forest Cover & Land Use Classification

[TABLE]
| Primary Product for VM0048 Forest Cover Baseline HabitatMapper™ is the official Verra-accredited product for Kenya under VM0048. It delivers 10 m land cover and forest cover classification at >90% accuracy, following VT0007 to produce the deforestation risk map required for REDD+ baseline construction. |
[/TABLE]

[TABLE]
| Parameter | HabitatMapper™ Specification |
| What is it? | Above-Ground Biomass Density (Mg/ha) and canopy structure estimates at site-specific level |
| Modelling Approach | Deep Bayesian Model; site-specific model built per project boundary |
| Reference Data | Explicit multimodal fusion of Field, Drone/Airborne LiDAR, and satellite data |
| Model Predictors | Multi-spectral and radar satellite constellations; topographic data |
| Uncertainty Quantification | Formal Bayesian UQ - full posterior probability distribution (95% credible interval); models aleatoric and epistemic uncertainty |
| Validation | Model loss via Continuous Ranked Probability Score (CRPS); statistical calibration of predictive intervals |
| Spatial Resolution | Multi-scale, returned at 10m |
| Temporal Coverage | Current year and previous 10 years |
| Temporal Resolution | Annual cadence |
| Science & Methods | Bayesian ML (Gaussian Processes and Variational Inference) |
| Data Range | 0 – 1000 Mg ha⁻¹ |
[/TABLE]

## CarbonMapper™ - Satellite Above-Ground Biomass Density
CarbonMapper™ provides satellite-derived AGBD estimates used alongside HabitatMapper™ for carbon stock quantification and historical baseline reconstruction. It is the recommended AGBD product for project screening and baseline scoping prior to field data collection.

[TABLE]
| Parameter | CarbonMapper™ Specification |
| What is it? | AGBD estimation at 10m granularity using Two-Stage Locally Adaptive Conformal Prediction (LACP) framework |
| Modelling Approach | Locally on-demand trained model (satellite only) |
| Reference Data (Labels) | GEDI L4A Monthly Biomass product |
| Model Predictors | Google Satellite Embeddings (V1 Annual), Copernicus GL030 DEM, RESOLVE 2017 Ecoregions, ESA WorldCover |
| Uncertainty Quantification | Pixel-level prediction intervals (90% CI) using Conformal Prediction |
| Validation | Split Conformal Prediction (LACP); R² and RMSE; Prediction Interval Coverage Probability (PICP) |
| Spatial Resolution | ≈ 10m |
| Temporal Coverage | Annual data from 2017 to present |
| Science & Methods | Random Forest, Deep Learning Embeddings, Conformal Prediction (LACP) |
[/TABLE]

## Space Intelligence Portfolio Screening
Space Intelligence’s portfolio screening capability provides rapid project scoping and feasibility assessment at national or regional scale, where speed and coverage matter more than sub-10 m precision.

[TABLE]
| Parameter | Space Intelligence Screening Specification |
| What is it? | AGBD estimation using Two-Stage LACP framework |
| Modelling Approach | Locally on-demand trained model (satellite only) |
| Spatial Resolution | ≈ 100m |
| Temporal Coverage | Single static map from most recent complete year; trained on 2019–2023 data |
| Science & Methods | Random Forest, Deep Learning Embeddings, Conformal Prediction (LACP) |
| Use Case | Project scoping, feasibility screening, rapid portfolio-level assessment |
[/TABLE]

## 5.2 Chloris Geospatial - Secondary AGBD Validation Layer
Chloris Geospatial’s Above-Ground Biomass Density product provides an independent, annually updated satellite-derived biomass map retained as a secondary cross-validation and fallback layer behind Space Intelligence’s HabitatMapper™/CarbonMapper™ products. It is used where Space Intelligence coverage is unavailable or additional independent validation is required.
Key validation results from Chloris’s 2026 white paper establish the product’s fitness for AFOLU carbon accounting:
NEON field plot comparison (38 US terrestrial sites): R² = 0.76 vs. ground survey biomass; R² = 0.92 vs. Airborne Laser Scanning (ALS)-derived biomass. Captures same signals of canopy growth and decline as measured canopy height data.
US Forest Inventory and Analysis (FIA) state-level comparison: R² = 0.90 for biomass stock; R² = 0.76 for biomass change. Demonstrates accurate characterisation at jurisdictional scale across temperate ecosystems.
Brazilian Amazon - ALS comparison (6 Amazonian states): R² = 0.74–0.90 vs. ALS-derived biomass maps.
Brazilian Amazon - GEDI change detection: Strong correlation (r = 0.76) between Chloris AGBD change and GEDI canopy height change in both growing plantations and stands losing biomass.

[TABLE]
| Application in the dMRV Platform The Chloris AGBD product will be used as: (1) a cross-validation layer for Space Intelligence CarbonMapper™ outputs during project screening; (2) a secondary annual biomass change signal for leakage belt monitoring; and (3) a 10-year historical baseline reconstruction input where Landsat-derived estimates are insufficient. |
[/TABLE]

## 5.3 The Ideal Output: Iterative Site-Specific Accuracy
The ideal measurement output of the platform is a site-specific biomass model that achieves progressively greater accuracy as more ground truth data is accumulated. The model achieves this through:
Integrating and fusing multi-spectral, radar satellite, and topographic data with high-certainty field and LiDAR reference data.
Formal Bayesian uncertainty quantification providing the full posterior probability distribution of the 95% credible interval.
Automatic uncertainty reduction as new field data is added - reinforcing data quality and model confidence over time.
Consistent quantification at scale across the project portfolio.
API-ready outputs enabling seamless integration with the Carbon Accounting Engine.
Multi-year coverage enabling annual monitoring report generation.
Quality assurance of biomass outputs is structured across three tiers: (1) ground dataset validation via DBH and height measurements from permanent monitoring plots; (2) replacement of global allometric assumptions with locally calibrated allometric equations; and (3) airborne validation via drone LiDAR where project scale and budget permit.

## 6. Methodology Framework
The Carbon Accounting Engine applies the logic of approved AFOLU carbon accounting methodologies in a codified, auditable manner. The platform’s Phase 1 anchor methodology is VM0048, with VM0047 (ARR) retained as a secondary methodology and a multi-methodology abstraction layer to be built in Phase 2.

## 6.1 VM0048 - Avoided Unplanned Deforestation (REDD+)
VM0048 is Verra's approved methodology for quantifying GHG emission reductions from Avoided Unplanned Deforestation (AUD) in tropical and subtropical forests. Space Intelligence is the official Verra data provider for Kenya under VM0048, and their Forest Cover Benchmark Map underpins the jurisdiction's deforestation risk map following tool VT0007. The platform will codify the full VM0048 computational logic - including historical reference region analysis, Forest Cover Benchmark Map integration, and leakage belt accounting, replacing manual spreadsheet calculations with automated, version-controlled accounting pipelines. All parameter values, allometric equations, emission factors, and methodological choices are logged with full audit trails to support VVB review.
Baseline deforestation rate computation using Space Intelligence's Forest Cover Benchmark Map for Kenya (VT0007-compliant)
Deforestation risk mapping using typical predictor variables (distance to forest edge, roads/rivers, slope, populated areas)
Avoided emissions quantification against Verra's official Historical Reference Period for the jurisdiction
Leakage belt deforestation monitoring using HabitatMapper™ land cover time series
Additionality demonstration via performance benchmark and risk assessment
Permanence and buffer pool contribution requirements

## 6.2 Future Methodology Expansion
Phase 2 will introduce a multi-methodology abstraction layer enabling efficient addition of further approved methodologies. Priority candidates based on Verst Carbon’s project pipeline include:
VM0047 v1.1 - Afforestation, Reforestation and Revegetation (ARR) - secondary methodology, codified in Phase 1 alongside VM0048
VM0042 - Improved Agricultural Land Management
VM0032 - Adoption of Sustainable Grasslands through Adjustment of Fire and Grazing
Gold Standard for the Global Goals (GS4GG) - Land Use & Forests methodologies

## 7. Technology Stack and Infrastructure
The technology stack is selected to balance technical capability, cost-efficiency, developer availability, and integration with the EO data ecosystem. Google Cloud Platform (GCP) is the recommended cloud infrastructure provider due to its native integration with Google Earth Engine, eliminating the need for expensive intermediate satellite processing infrastructure.

[TABLE]
| Layer | Technology / Tools |
| Frontend (Web) | React.js - primary web platform interface for project managers and analysts |
| Frontend (Mobile) | React Native or Flutter - offline-first mobile field data collection app |
| Backend API | Python FastAPI - primary APIs; Node.js for event-driven data pipeline orchestration |
| EO & Geospatial Processing | Google Earth Engine (primary); GDAL/Rasterio; Sentinel Hub API; Planet API |
| Machine Learning / AI | TensorFlow / PyTorch (biomass models); Scikit-learn (calibration and baseline regression) |
| Spatial Database | PostgreSQL + PostGIS - for spatial data storage and querying |
| Time-Series Database | InfluxDB — for carbon stock time-series and monitoring data |
| Data Lake / Object Storage | AWS S3 or Google Cloud Storage (GCS) - for raster data lake and document storage |
| Cloud Infrastructure | Google Cloud Platform (GCP) - Docker + Kubernetes for containerised deployment |
| Field Data Collection | KoboCollect (offline-first surveys); Survey123; ArcGIS Field Maps; IoT sensors |
| Biomass Data APIs | Space Intelligence API (HabitatMapper™, CarbonMapper™); Chloris Geospatial API (fallback) (depending on agreement reached) |
| Carbon Accounting | Custom Python methodology engine (VM0048 logic, codified and version-controlled). Registry Intelligence API. PDD Authoring Verst Carbon AI PDD Generator (verst.earth/ai-pdd-generator-https://aipdd-frontend-production.up.railway.app/) - LLM-based auto-population of methodology-compliant PDD sections from platform-computed carbon data; methodology shortlisting; reduces preparation time from months to days; 70% cost reduction vs. manual drafting. |
[/TABLE]

[TABLE]
| Infrastructure Recommendation: GCP GCP is strongly preferred as the cloud provider. Native Google Earth Engine integration eliminates the need to build or license expensive satellite data processing infrastructure. GEE’s planetary-scale geospatial computing removes the primary technical bottleneck in EO-based MRV at scale. |
[/TABLE]

## GEE Ingestion Layer - Data Pipeline Architecture
Google Earth Engine (GEE) functions as the primary ingestion and preprocessing layer for all satellite-derived inputs. Rather than building a bespoke satellite processing stack, the platform leverages GEE's planetary-scale compute and pre-loaded data catalogue to produce analysis-ready raster stacks at zero marginal cost per scene.
The following datasets are accessed directly from the GEE data catalogue without download or hosting cost:
Sentinel-2 SR (10m optical, cloud-masked time series)
Sentinel-1 GRD (10m SAR backscatter, VV/VH polarisation)
Landsat Collection 2 archive (30m, historical baseline)
GEDI Level 4A canopy height composites
Hansen Global Forest Change (30m, annual loss/gain)
CHIRPS rainfall (5km, daily)
ERA5-Land climate variables (0.1°, monthly)
iSDAsoil Africa 30m (SOC, pH, bulk density, texture)
WorldClim v2.1 bioclimatic variables (1km)
MODIS/VIIRS burned area MCD64A1.
For each project area, a GEE script generates a cloud-masked, time-series-normalised, co-registered raster stack covering the project boundary plus a configurable buffer (default: 10 km for leakage belt). The stack is exported to a dedicated Google Cloud Storage (GCS) bucket as a multi-band GeoTIFF (EPSG:4326, COG format). This export is triggered manually in Phase 1 (analyst-initiated per monitoring cycle) and transitions to automated scheduling in Phase 2 (Cloud Scheduler → GEE Batch API).
A Cloud Run service monitors the GCS bucket for new raster exports. On detection, it packages the analysis-ready stack and routes it to the appropriate inference endpoint: Space Intelligence API (preferred Phase 1 path, subject to commercial agreement); Lang + Chloris + allometric regression fallback endpoint (Phase 1 fallback, zero API cost, no vendor dependency); or internal ML inference endpoint (Phase 2–3). The routing logic is a single environment variable; switching from fallback to preferred path requires no code change. Results are written back to GCS and ingested by the Accounting Engine via a PostGIS spatial query. This event-driven pattern means the GEE export is the only manual step in the pipeline at Phase 1 all downstream processing is automated.
GEE-as-ingestion-layer does not change the three-engine architecture described in Section 2; it refines the internal implementation of the Measurement Engine's data ingestion step. The critical design consequence is that GCP (not AWS) becomes the natural cloud provider, GEE exports to GCS natively, and running the Cloud Run trigger, PostGIS database, and ML inference endpoints all on GCP eliminates cross-cloud egress costs and authentication complexity. The tech stack table above already reflects this (GCP + GCS). No additional licensing cost is required beyond GEE's free tier for non-commercial research use; commercial use at scale requires a GEE commercial licence (Google Cloud, negotiated).
Phase 1 (manual-trigger, <10 projects): analyst runs GEE script per project per cycle → exports to GCS → Cloud Run routes to Space Intelligence API (preferred, if contracted) or Lang/Chloris/allometric fallback (if not yet contracted) → results ingested. Estimated analyst time: 2–4 hours per project per monitoring cycle. Phase 2 (automated, 10–50 projects): Cloud Scheduler triggers GEE Batch API on a fixed cadence (monthly or quarterly) → all active project boundaries processed → results queued for Accounting Engine → no analyst intervention required for routine cycles.
Note on Microsoft Planetary Computer Pro (June 2026): Microsoft Planetary Computer Pro reached General Availability in mid-2026 as an enterprise-grade Azure service for ingesting, cataloguing, and processing geospatial data at scale. Of direct relevance to this platform: Space Intelligence — the preferred biomass API in this architecture — runs its AI/ML pipelines on Planetary Computer Pro to process petabytes of Earth observation data for forest carbon and deforestation monitoring. This creates a potential future infrastructure pathway. If Verst Carbon deepens its Space Intelligence partnership and requires direct access to upstream EO data pipelines, Planetary Computer Pro on Azure represents a credible alternative or complement to the GCP/GEE stack described above — particularly for private geospatial data cataloguing (STAC-standard) and enterprise AI integration via Microsoft Foundry. For Phase 1–2, the GCP/GEE path remains recommended given its zero-marginal-cost EO data access. Planetary Computer Pro should be evaluated at Phase 3 when data management complexity and partner integration depth may justify an enterprise platform.

## 8. Phased Build Roadmap
The platform will be built across three structured phases, each with clearly defined scope, success criteria, and go/no-go milestones. The phased approach prioritises discipline over ambition: Phase 1 must demonstrate a working end-to-end loop on a real project before Phase 2 investment is committed.

## Phase 1: MVP - Validate the Core Loop (Months 1–9)
EO carbon engine operational on Google Earth Engine - ingestion, preprocessing, and AGBD estimation pipeline for project boundaries
VM0048 accounting logic codified and automated (baseline, leakage, additionality, net credit forecast)
Core carbon accounting module with credit forecast export
Structured PDD draft export via templates
Integration of Space Intelligence HabitatMapper™/CarbonMapper™ (primary) and Chloris AGBD (fallback) as baseline biomass data sources
GCP infrastructure provisioned; Earth Engine processing environment configured
Pilot project selected in Kenya or Uganda and run through the full pipeline

## Phase 2: Hybrid MRV and Smallholder Module (Months 9–18)

[TABLE]
| Phase 2 Priority Build the Africa differentiator: EO and field plot calibration regression (Hybrid MRV) combined with offline mobile data collection for smallholder landscapes. |
[/TABLE]
Field data ingestion via KoboCollect and/or survey 123 integration
EO and field plot calibration regression - Hybrid MRV pipeline producing validated tCO₂e dataset
Space Intelligence CarbonMapper™ integration — satellite AGBD product per enrolled project under VM0048
Offline-first mobile field app (React Native / Flutter) for smallholder data collection
FPIC document management module with completeness checking
Benefit sharing and grievance tracking module
Expansion to a second approved methodology (e.g., VM0047 or equivalent)
Multi-methodology abstraction layer

## Phase 3: Compliance Intelligence and PDD Automation (Months 18–30)
AI-assisted additionality and permanence checks with human sign-off queue
Leakage belt EO monitoring - automated detection of activity-shifting outside project boundary
Auto-generated PDD sections - AI-populated narrative sections reducing PDD preparation time
Verification dossier builder - compilation of all monitoring evidence into structured VVB submission package
Multi-methodology abstraction layer - efficient onboarding of additional approved methodologies
VVB trust layer - standardised data export formats aligned with VVB expectations

## 9. Use Cases
The three use cases below illustrate how Verst Carbon's dMRV platform operates end-to-end across distinct project contexts. Each use case maps to specific platform engines and document sections, demonstrating how the Three-Engine System translates raw satellite and field data into audit-ready carbon credit documentation.

[TABLE]
| Use Case 1: Smallholder Landscape Onboarding and Baseline Construction A project developer is onboarding a fragmented smallholder agroforestry landscape in Kenya, a context where conventional MRV is cost-prohibitive. The Measurement Engine ingests Sentinel-2, SAR, and GEDI data via the GEE pipeline and trains a site-specific ML biomass model at 10 m resolution. Because the landscape is heterogeneous and connectivity is constrained, the field data collection module deploys KoboCollect in offline mode, syncing field plot measurements when coverage is available. The Bayesian calibration step fuses the EO-derived biomass estimates with the field plots, producing a validated carbon stock map with formal uncertainty bounds. The Carbon Accounting Engine then constructs a dynamic baseline from permanent control plots of similar ecology. Outcome: a credit forecast with confidence intervals is generated for a landscape that was previously uneconomical to certify demonstrating the platform's core market-access thesis. |
| Use Case 2: Annual Monitoring Cycle for a Registered ARR Project A registered ARR project in Kenya enters its third annual monitoring cycle. The Measurement Engine automatically ingests the latest Sentinel-2 and SAR acquisitions for the project boundary, runs cloud masking and temporal normalisation, and applies the site-specific biomass model to produce an updated tCO₂e per-pixel map. The change detection module computes year-on-year biomass gain against the prior monitoring period and flags disturbance patches in the eastern boundary for field verification. Simultaneously, the Carbon Accounting Engine updates the dynamic baseline by comparing project carbon stocks against the live control plot trajectory, calculates net additionality, and produces a revised credit forecast. The Compliance Engine appends the monitoring outputs to the verification dossier and generates a draft Monitoring Report section pre-populated with all platform-computed values. Outcome: a complete, audit-ready annual monitoring package is produced within days rather than weeks, at a fraction of conventional MRV cost. |
| Use Case 3: Automated VVB Submission Package Assembly A project team is preparing its first submission to a VVB for a REDD+/afforestation project. The Compliance Engine's Verification Dossier Builder automatically compiles the satellite analysis outputs, field survey records, FPIC documentation, and additionality evidence into a structured dossier. The platform-computed baseline, additionality, and leakage values are passed to Verst Carbon's AI PDD Generator, which auto-populates the relevant methodology-compliant PDD sections using large language models-cutting document preparation from months to days. An AI-assisted gap identification pass then flags missing barrier analysis elements and routes them to a human sign-off queue. The project team reviews and clears each flag before exporting the final package. Outcome: the VVB receives a structured, audit-ready dossier built end-to-end within the Verst toolchain - reducing preparation time and the likelihood of material queries and directly supporting the Phase 1 success criterion of VVB-ready PDD output. |
[/TABLE]

## 10. Risk Assessment
The following risk register captures the primary technical, operational, and strategic risks associated with the dMRV platform build, along with recommended mitigations.

[TABLE]
| Risk | Category | Likelihood | Impact | Mitigation |
| Scope creep - adding compliance AI before core accounting is validated | Scope | High | High | Enforce Phase 1 go/no-go milestone. VVB validation of core accounting before Phase 2 investment. |
| Offline-first mobile UX underestimated | Technical | High | Medium | Plan conservatively; prototype early with field teams. Consider phased mobile rollout. |
| Registry integration complexity | Compliance | Medium | High | Engage Verra and GS methodologies. Design output formats to registry specifications from the start. |
| VM0048 methodology changes (regulatory risk) | Regulatory | Low | High | Abstract methodology logic into modular, version-controlled modules. Monitor Verra consultations. |
| Satellite data access costs at scale | Financial | Medium | Medium | Prioritise free EO sources (Sentinel, Landsat, GEDI) in Phase 1. Commercial sources (Planet, Vantor (formerly Maxar)) reserved for high-value sites. |
| Field data quality in low-literacy environments | Operational | High | Medium | Design mobile app with visual, low-text interfaces. Field enumerator training and QA protocols built into platform workflow. |
| Space Intelligence/Chloris API dependency | Technical | Low | High | Phase 1: fallback pipeline (Lang canopy height + Chloris AGBD + published allometrics) is built into the architecture from day one - if Space Intelligence or Chloris APIs are unavailable, the system routes automatically to the zero-cost fallback with no analyst intervention. Negotiate SLAs and contractual uptime commitments before production go-live. Phase 2–3: fine-tune open-weight geospatial foundation model (NASA/IBM Prithvi or SatMAE++) on Verst's accumulated field plots to produce Africa-specific embeddings - eliminating all vendor API dependencies by Month 30. |
| VVB resistance to satellite-derived MRV | Market | Medium | High | Engage VVBs in Phase 1 pilot. Document validation methodology rigorously. Cite Space Intelligence/Chloris published validation studies. |
[/TABLE]

## 11. Recommended Next Steps
The following actions are recommended to initiate the Phase 1 build and move the concept from design to implementation:

[TABLE]
|  | Action | Owner | Timeline |
| 1 | Align on Phase 1 scope internally - lock VM0048 as the anchor methodology and define VVB submission as the Phase 1 success criterion. Obtain leadership sign-off on Phase 1 budget. | Technical Leads / Director of Carbon Project Development | Immediate |
| 2 | Select the Phase 1 pilot project - identify one AFOLU ARR or reforestation project in Kenya or Uganda with sufficient historical EO coverage and an accessible field team. | Technical Leads | Within 2 weeks |
| 3 | Provision GCP and GEE infrastructure - set up project environments, IAM permissions, and begin EO data pipeline development in Google Earth Engine. | Technical Leads | Weeks 2–4 |
| 4 | Initiate Space Intelligence commercial engagement - negotiate API access for HabitatMapper™/CarbonMapper™ products and Forest Cover Benchmark Map delivery under VM0048/VT0007; define data delivery format and integration architecture. Note: Phase 1 build is not blocked on this agreement - the Lang/Chloris/allometric fallback pipeline can be built and tested in parallel, and the routing switch to Space Intelligence requires only a config change once the contract is signed. | Director of Carbon Project Development/Technical Leads | Within 1 month |
| 5 | Initiate Chloris Geospatial engagement - obtain API access to Chloris AGBD product for secondary cross-validation and historical reconstruction (fallback layer behind Space Intelligence). | Director of Carbon Project Development/Technical Leads | Within 1 month |
| 6 | Design the field data collection protocol for the pilot — define KoboCollect form structure, QA procedures, and field enumerator training plan. | Technical Leads | Within 1 month |
| 7 | Engage a VVB informally on digital MRV acceptability - seek pre-submission guidance on data format expectations for satellite-derived biomass inputs. | Technical Leads | Within 6 weeks |
| 8 | Establish the Phase 1 go/no-go milestone criteria - define measurable criteria for the VVB-ready PDD output that will trigger Phase 2 investment approval. | Leadership | Before build start |
[/TABLE]

## 12. Conclusion
The dMRV platform represents a strategic investment in Verst Carbon’s long-term capability to develop, verify, and scale high-integrity AFOLU carbon projects across Africa. By combining best-in-class satellite biomass modelling with field-calibrated hybrid MRV, AI-assisted compliance tooling, and offline-first field data infrastructure, the platform addresses the fundamental barriers that have historically limited the credibility and commercial viability of African AFOLU carbon projects.
The three-engine architecture: Measurement, Carbon Accounting, and Compliance is technically sound and sequenced appropriately across the three build phases. The critical discipline is phasing: the platform’s success depends on validating the core accounting loop with real VVBs before scaling into compliance AI and multi-methodology expansion.
The hybrid MRV capability fusing Earth Observation data with field-calibrated, site-specific Bayesian biomass models is Verst Carbon’s primary technical market differentiator. It positions Verst Carbon to issue carbon credits that are not merely compliant, but demonstrably more accurate, more transparent, and more defensible than those produced by conventional MRV approaches.

## 13. Budget and Cost Considerations
This section consolidates the platform infrastructure and third-party data costs. Cost items span three categories: Google Cloud Platform (GCP) infrastructure, Google Earth Engine (GEE) commercial licensing, and external data API agreements with Space Intelligence (primary provider, HabitatMapper™/CarbonMapper™) and Chloris Geospatial (secondary fallback). Actual spend will depend on project portfolio scale, negotiated API terms, and GCP architecture choices made during detailed design.

[TABLE]
| Cost Category | Item | Phase 1 (Mo 0–9) | Phase 2 (Mo 10–18) | Phase 3 (Mo 19–30) | Description |
| GCP Infrastructure | Cloud Run / GKE (compute) | $300/month | $800/month | $2,500/month | Scales with inference requests and batch runs. Spot VMs for batch reduce Phase 3 cost by ~60–70%. A 3-node e2-standard-2 cluster runs ~$292/mo; start with Cloud Run (free tier generous) before committing to GKE. |
|  | Cloud Storage (GCS) — raster/vector outputs | $20/month | $100/month | $400/month | $0.02/GB/month standard tier. Main driver is GEE export storage and model output mosaics. Egress costs apply for data leaving GCP to external systems. |
| Google Earth Engine | Commercial licence (EECU compute + storage) | $0 (non-commercial build phase) | $2,000/month (Professional) | $5,000+/mo (Premium / enterprise) | Free tier valid only while platform is not used for commercial deliverables. Licence required once pilot credits are issued. Basic tier: $500/mo, 2 seats, 100 EECU-hours batch. Google for Startups Cloud Program: up to $100k combined GCP+GEE credits over Years 1–2. |
| Space Intelligence API | HabitatMapper™ (VM0048 forest cover) + CarbonMapper™ (AGBD) | $25k (Proposal 1: Tsavo/Meru/Kora) or $6,990 (Proposal 2: mangroves) | Ongoing licence / annual monitoring (TBC with SI) | Portfolio-scale monitoring (TBC with SI) | Official Verra data provider for Kenya under VM0048 (VT0007 Forest Cover Benchmark Map). Proposal 1 ($25k) covers ARR+REDD pre-feasibility for Tsavo East/West, Meru, Kora. Proposal 2 ($6,990) covers mangrove pre-feasibility at Kisite-Mpunguti under VM0007/VM0033. |
| Chloris Geospatial (secondary / fallback) | AGBD annual time-series (30m/10m) - baseline cross-validation | $5,000/yr entry + pilot AOI pull | $5k–$15k/yr (expanded AOI) | $15k–$40k/yr (portfolio scale) | Secondary AGBD cross-validation layer where Space Intelligence products are not available or additional independent validation is required. Publicly stated entry price: $5,000/yr. Not the primary provider for Kenya VM0048 projects. |
| Third-party EO Data | Planet / Maxar VHR imagery (Phase 2+ only) | Not required | $3k–$10k/yr (targeted high-value sites) | $10k–$30k+/yr (portfolio monitoring) | Free EO (Sentinel-2, Landsat, GEDI) covers MVP and most operational needs. VHR warranted only where credit value or project type requires sub-5m resolution. Evaluate on a per-project basis. |
| TOTAL | All categories combined | ~$28k | ~$81k | ~$195k | Excludes internal development effort and staff costs. Google for Startups credits and negotiated API terms could materially reduce Phase 1 and Phase 2 totals. |
[/TABLE]
Several mechanisms can materially reduce the infrastructure and data costs set out above:
Google for Startups Cloud Program: Verst Carbon should apply immediately. The programme provides up to $100,000 in GCP credits for each of the first two years, covering Cloud Run, GCS, GKE, and GEE commercial compute. This could absorb the majority of Phase 1 and Phase 2 infrastructure costs.
GEE free tier during development: The free tier is valid for non-commercial R&D. Verst Carbon may legitimately run the platform on the free tier through Phase 1 MVP build, provided pilot outputs are not used for commercial credit issuance.
Spot / Preemptible VMs on GCP: Batch ML inference and GEE export pipelines are interruptible workloads — scheduling these on Spot VMs reduces compute cost by approximately 60–70% versus on-demand pricing.
Negotiated API access — Space Intelligence and Chloris: Space Intelligence operates project-based pricing (Proposal 1: $25k for ARR+REDD pre-feasibility across Tsavo East/West, Meru, Kora; Proposal 2: $6,990 for Kisite-Mpunguti mangrove pre-feasibility). Chloris retains negotiated commercial terms as a secondary validation layer. Initiate the Space Intelligence engagement during Phase 1 scoping (Action 3, §11).
Chloris free exploration tier: Chloris makes historical AGBD data free to explore via its platform. This is sufficient for secondary cross-validation of Space Intelligence outputs during Phase 1 before a commercial API agreement is required.

## Appendix A: Acronym Glossary

[TABLE]
| Acronym | Definition |
| AFOLU | Agriculture, Forestry and Other Land Use |
| AGBD | Above-Ground Biomass Density |
| AGB | Above-Ground Biomass |
| ALS | Airborne Laser Scanning |
| ARR | Afforestation, Reforestation and Revegetation |
| BGB | Below-Ground Biomass |
| CRPS | Continuous Ranked Probability Score |
| DBH | Diameter at Breast Height |
| dMRV | Digital Measurement, Reporting and Verification |
| EO | Earth Observation |
| FPIC | Free, Prior and Informed Consent |
| GCP | Google Cloud Platform |
| GEE | Google Earth Engine |
| GEDI | Global Ecosystem Dynamics Investigation (NASA LiDAR mission) |
| GHG | Greenhouse Gas |
| GS4GG | Gold Standard for the Global Goals |
| IB10 | Integrated Biomass Model (formerly Treeconomy) — see HabitatMapper™ (Space Intelligence) |
| IPCC | Intergovernmental Panel on Climate Change |
| LACP | Locally Adaptive Conformal Prediction |
| LiDAR | Light Detection and Ranging |
| LULC | Land Use, Land Cover |
| ML | Machine Learning |
| MRV | Measurement, Reporting and Verification |
| NBS | Nature-Based Solutions |
| PDD | Project Design Document |
| PICP | Prediction Interval Coverage Probability |
| REDD+ | Reducing Emissions from Deforestation and Forest Degradation |
| RMSE | Root Mean Square Error |
| SAR | Synthetic Aperture Radar |
| SB10 | Advanced Satellite-Only Biomass Model (formerly Treeconomy) — see CarbonMapper™ (Space Intelligence) |
| SB100 | Basic Satellite-Only Biomass Model (formerly Treeconomy) — see Space Intelligence Portfolio Screening |
| SOC | Soil Organic Carbon |
| UQ | Uncertainty Quantification |
| VCS | Verified Carbon Standard (Verra) |
| VVB | Validation and Verification Body |
[/TABLE]

## Appendix B: d-MRV Architecture

## Appendix C: API
Earth Engine API - earthengine.googleapis.com - satellite data ingestion and processing via Google Earth Engine - $ 500/month basic user - $ 5,000/month advanced user
Cloud Run API - run.googleapis.com - the serverless compute service that hosts the AGBD inference router and pipeline trigger
Cloud SQL Admin API - sqladmin.googleapis.com - manages the PostGIS database instance where all carbon pool data, audit logs, and credit forecasts are stored
Cloud Storage API - storage.googleapis.com - the GCS bucket that holds all exported raster stacks (GeoTIFFs) and the versioned AGBD archive
Cloud Pub/Sub API - pubsub.googleapis.com - the event trigger that fires Cloud Run automatically whenever a new raster stack lands in GCS
Cloud Build API - cloudbuild.googleapis.com - the CI/CD pipeline that runs automated tests and builds Docker containers on every code push to GitHub
Artifact Registry API - artifactregistry.googleapis.com - stores the Docker container images that Cloud Run pulls and deploys – billed at usage rate.
