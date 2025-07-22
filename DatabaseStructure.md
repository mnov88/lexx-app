# DatabaseStructure.md

Supabase schema is attached below, followed by indices. 
Under this, you will find a list of sample data per table.
When making any decisions, make sure to consult both the schema and sample data to ensure full understanding and identify the best approach and strategy.
NB: Case law field 'interprets article' is just a convenience list of all articles interpreted in its operative parts. Critical: to understand the relationship between case law interpreting an article and operative part interpreting article, please pay attention to how I describe the issue in the list of pages to develop ie Deliverables.md, specifically CaseInfoCard discussion, where data structure is explained in more detail.
NB: operative_part_mentions_article will be deprecated; interprets_article should be used.

-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

## Schema

CREATE TABLE public.articles (
  article_number integer,
  legislation_id uuid,
  article_number_text text NOT NULL,
  title text NOT NULL,
  filename text,
  markdown_content text,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT articles_pkey PRIMARY KEY (id),
  CONSTRAINT articles_legislation_id_fkey FOREIGN KEY (legislation_id) REFERENCES public.legislations(id)
);
CREATE TABLE public.case_law_interprets_article (
  case_law_id uuid,
  article_id uuid,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT case_law_interprets_article_pkey PRIMARY KEY (id),
  CONSTRAINT case_law_interprets_article_case_law_id_fkey FOREIGN KEY (case_law_id) REFERENCES public.case_laws(id),
  CONSTRAINT case_law_interprets_article_article_id_fkey FOREIGN KEY (article_id) REFERENCES public.articles(id)
);
CREATE TABLE public.case_laws (
  operative_parts_combined text,
  operative_parts_individual jsonb,
  html_content text,
  plaintext_content text,
  celex_number text NOT NULL UNIQUE,
  case_id_text text,
  title text NOT NULL,
  court text,
  date_of_judgment date,
  parties text,
  summary_text text,
  html_content_link text,
  plaintext_content_link text,
  source_url text,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT case_laws_pkey PRIMARY KEY (id)
);
CREATE TABLE public.document_chunks (
  case_law_id uuid,
  operative_part_id uuid,
  article_id uuid,
  chunk_text text NOT NULL,
  embedding USER-DEFINED,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT document_chunks_pkey PRIMARY KEY (id),
  CONSTRAINT document_chunks_case_law_id_fkey FOREIGN KEY (case_law_id) REFERENCES public.case_laws(id),
  CONSTRAINT document_chunks_operative_part_id_fkey FOREIGN KEY (operative_part_id) REFERENCES public.operative_parts(id),
  CONSTRAINT document_chunks_article_id_fkey FOREIGN KEY (article_id) REFERENCES public.articles(id)
);
CREATE TABLE public.legislations (
  full_markdown_content text,
  celex_number text NOT NULL UNIQUE,
  title text NOT NULL,
  publication_date date,
  document_type text,
  summary text,
  source_url text,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT legislations_pkey PRIMARY KEY (id)
);
CREATE TABLE public.operative_part_interprets_article (
  operative_part_id uuid,
  article_id uuid,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT operative_part_interprets_article_pkey PRIMARY KEY (id),
  CONSTRAINT operative_part_interprets_article_operative_part_id_fkey FOREIGN KEY (operative_part_id) REFERENCES public.operative_parts(id),
  CONSTRAINT operative_part_interprets_article_article_id_fkey FOREIGN KEY (article_id) REFERENCES public.articles(id)
);
CREATE TABLE public.operative_part_mentions_legislation (
  operative_part_id uuid,
  mentioned_legislation_id uuid,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT operative_part_mentions_legislation_pkey PRIMARY KEY (id),
  CONSTRAINT operative_part_mentions_legislation_operative_part_id_fkey FOREIGN KEY (operative_part_id) REFERENCES public.operative_parts(id),
  CONSTRAINT operative_part_mentions_legislati_mentioned_legislation_id_fkey FOREIGN KEY (mentioned_legislation_id) REFERENCES public.legislations(id)
);
CREATE TABLE public.operative_parts (
  markdown_content text,
  case_law_id uuid,
  part_number integer NOT NULL,
  verbatim_text text,
  simplified_text text,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT operative_parts_pkey PRIMARY KEY (id),
  CONSTRAINT operative_parts_case_law_id_fkey FOREIGN KEY (case_law_id) REFERENCES public.case_laws(id)
);

## Indices

|Schema|Table|Name||
|---|---|---|---|
|public|articles|articles_legislation_id_article_number_text_key|View definition|
|public|articles|articles_pkey|View definition|
|public|case_law_interprets_article|case_law_interprets_article_case_law_id_article_id_key|View definition|
|public|case_law_interprets_article|case_law_interprets_article_pkey|View definition|
|public|case_laws|case_laws_celex_number_key|View definition|
|public|case_laws|case_laws_pkey|View definition|
|public|document_chunks|document_chunks_pkey|View definition|
|public|article_case_summary|idx_article_case_summary_article_id|View definition|
|public|article_case_summary|idx_article_case_summary_legislation_id|View definition|
|public|articles|idx_articles_legislation_id|View definition|
|public|articles|idx_articles_title_fts|View definition|
|public|case_law_interprets_article|idx_case_law_interprets_article_article_id|View definition|
|public|case_law_interprets_article|idx_case_law_interprets_article_case_law_id|View definition|
|public|case_laws|idx_case_laws_combined_text_gin|View definition|
|public|case_laws|idx_case_laws_parties_gin|View definition|
|public|case_laws|idx_case_laws_summary_fts|View definition|
|public|case_laws|idx_case_laws_title_fts|View definition|
|public|case_laws|idx_case_laws_title_gin|View definition|
|public|document_chunks|idx_document_chunks_article_id|View definition|
|public|document_chunks|idx_document_chunks_case_law_id|View definition|
|public|document_chunks|idx_document_chunks_embedding_hnsw|View definition|
|public|document_chunks|idx_document_chunks_metadata_gin|View definition|
|public|document_chunks|idx_document_chunks_operative_part_id|View definition|
|public|legislations|idx_legislations_title_fts|View definition|
|public|operative_part_interprets_article|idx_operative_part_interprets_article_article_id|View definition|
|public|operative_part_interprets_article|idx_operative_part_interprets_article_operative_part_id|View definition|
|public|operative_part_mentions_legislation|idx_operative_part_mentions_legislation_mentioned_legislation_i|View definition|
|public|operative_part_mentions_legislation|idx_operative_part_mentions_legislation_operative_part_id|View definition|
|public|operative_parts|idx_operative_parts_case_law_id|View definition|
|public|legislations|legislations_celex_number_key|View definition|
|public|legislations|legislations_pkey|View definition|
|public|operative_part_interprets_article|operative_part_interprets_arti_operative_part_id_article_id_key|View definition|
|public|operative_part_interprets_article|operative_part_interprets_article_pkey|View definition|
|public|operative_part_mentions_legislation|operative_part_mentions_legis_operative_part_id_mentioned_l_key|View definition|
|public|operative_part_mentions_legislation|operative_part_mentions_legislation_pkey|View definition|
|public|operative_parts|operative_parts_case_law_id_part_number_key|View definition|
|public|operative_parts|operative_parts_pkey|

## Sample data

### operative_parts

id	case_law_id	part_number	verbatim_text	simplified_text	created_at	updated_at	markdown_content
e216b9f9-fdbd-489d-b047-cdaed44e1993	5eec622b-cd86-423a-9f35-4a36f5c5c24a	1	Article 3(d) of Regulation (EC) No 469/2009 of the European Parliament and of the Council of 6 May 2009 concerning the supplementary protection certificate for medicinal products must be interpreted as meaning that a marketing authorisation cannot be considered to be the first marketing authorisation, for the purpose of that provision, where it covers a new therapeutic application of an active ingredient, or of a combination of active ingredients, and that active ingredient or combination has already been the subject of a marketing authorisation for a different therapeutic application.	Under Article 3(d) of Regulation No 469/2009, a marketing authorisation for a new therapeutic use of an active ingredient, or a combination of active ingredients, is not considered the first marketing authorisation if that active ingredient or combination has already received a marketing authorisation for a different therapeutic use.	2025-07-16 19:47:00.57179+00	2025-07-16 19:47:00.57179+00	Article 3(d) of Regulation (EC) No 469/2009 of the European Parliament and of the Council of 6 May 2009 concerning the supplementary protection certificate for medicinal products must be interpreted as meaning that a marketing authorisation cannot be considered to be the first marketing authorisation, for the purpose of that provision, where it covers a new therapeutic application of an active ingredient, or of a combination of active ingredients, and that active ingredient or combination has already been the subject of a marketing authorisation for a different therapeutic application.
9247a65d-fe6e-4a0c-bf75-6db2a8520b02	abee04de-7789-4b40-a87e-e09e05a653fc	1	1. **Points 1 and 2 of Article 4 of Regulation (EU) 2016/679 of the European Parliament and of the Council of 27 April 2016 on the protection of natural persons with regard to the processing of personal data and on the free movement of such data, and repealing Directive 95/46/EC (General Data Protection Regulation)	Under Article 4(1) and (2) of the GDPR, the definitions of ‚Äòpersonal data‚Äô and ‚Äòprocessing‚Äô apply.	2025-07-16 19:46:58.901841+00	2025-07-16 19:46:58.901841+00	1. **Points 1 and 2 of Article 4 of Regulation (EU) 2016/679 of the European Parliament and of the Council of 27 April 2016 on the protection of natural persons with regard to the processing of personal data and on the free movement of such data, and repealing Directive 95/46/EC (General Data Protection Regulation)

### operative_part_interprets_article

id,operative_part_id,article_id,created_at
00b22a0e-5a16-4da0-a5ca-d0d232507f21,e3d147c9-8e40-4c67-962f-3a03f407bc5a,6f8a7fea-8f76-484e-85b2-ed75b25daaf5,2025-07-02 20:41:01.763261+00
00b2f86a-5642-4f79-87be-af7d4313a615,7ac438ff-2ecf-41e1-966b-afe0775cacc7,0e0e6908-a97d-42c2-bfe4-2811c998c9d3,2025-07-02 20:41:01.763261+00

### legislations

be950a32-be39-4713-ab12-a095ca87a5f3	32016R0679	GDPR		REG			2025-07-16 19:39:14.654709+00	2025-07-16 19:39:14.654709+00	Bearing in mind...
e0208fbe-3ff8-4437-94b7-d1798b5b9dca	32012R1215	Brussels I Recast		REG			2025-07-09 17:43:19.967272+00	2025-07-09 17:43:19.967272+00	This Regulation has..

### document_chunks

id	case_law_id	operative_part_id	article_id	chunk_text	embedding	metadata	created_at	updated_at
028acee0-6723-4c74-b26b-479cf0004efc		efbcda09-4acc-4149-8c2c-91bc3d6b0d10		Article 4(7) of Regulation (EU) 2016/679 of the European Parliament and of the Council of 27 April 2016 on the protection of natural persons with regard to the processing of personal data and on the free movement of such data, and repealing Directive 95/46/EC (General Data Protection Regulation) must be interpreted as meaning that, in so far as a Petitions Committee of the parliament of a Federated State of a Member State determines, alone or with others, the purposes and means of the processing of personal data, that committee must be categorised as a ‚Äòcontroller‚Äô, within the meaning of that provision, and consequently the processing of personal data carried out by that committee falls within the scope of that regulation and, in particular, of Article 15 thereof.	[-0.019420294,-0.03397565,0.02105691,-0.055386722,0.033424266,0.016091783,0.08347888,0.02125492,0.0014955116,-0.015647952,-0.016785938,-0.07159299,0.01757523,0.038138438,-0.008445283,0.026022958,-0.00035567704,0.01764744,-0.013707066,0.06095244,0.07149259,-0.028078487,-0.03870591,-0.0565193,-0.013946894,0.03907221,-0.026490219,-0.058381148,-0.06511512,-0.17975004,-0.045767773,-0.054442756,0.0064400285,-0.022086611,0.004922322,-0.09646827,-0.023820471,0.024078276,-0.05594354,0.056280993,0.021223208,-0.0019795897,-0.00090651965,-0.012306574,-0.02040466,0.00010616969,0.0080738375,0.008335425,-0.041359525,-0.042563003,0.030236932,-0.010591606,0.03271103,0.03454448,0.013751743,0.05526496,0.053543054,-0.0029232786,0.05672675,0.030637532,0.055131145,0.044533435,-0.24510725,0.082704104,0.011881346,0.055618726,-0.043177795,-0.023852017,0.008905816,0.011503586,-0.0533994,0.021012373,0.003014249,0.04259296,-0.0049541043,-0.023735393,-0.014754414,-0.020694546,-0.025609158,0.032746553,-0.009151913,0.060443304,-0.036243163,-0.03267154,-0.025471944,-0.04836054,0.009705459,-0.08772582,0.033649497,-0.02232675,-0.05433524,0.008366964,0.020352768,0.03984963,-0.06436539,-0.046562884,0.0010382098,0.032209024,-0.03338443,0.17958845,-0.049979243,0.051038288,0.009087698,0.0067372853,-0.007443817,-0.03606346,0.013944119,-0.022525772,-0.0031943233,-0.005915234,-0.040113837,-0.04232362,0.020290691,-0.039869882,0.009689761,0.06379202,0.032535262,0.043772515,0.0030101142,-0.009944564,-0.0014945973,0.008338581,0.025312781,0.011516352,0.05624372,0.002467874,0.05162952,0.098711245,0.067192145,0.045414083,0.058525044,-0.039403047,-0.047930285,-0.009570658,-0.020744529,0.008020606,0.01260887,0.0113547165,0.017471705,-0.06334698,-0.056422394,-0.1397168,-0.02158458,-0.0782643,0.019776786,0.12200966,0.016901504,0.030031886,-0.07961648,0.030351777,-0.019821744,0.08399669,-0.0117666675,0.0059850505,-0.004062496,0.03703482,-0.014564254,0.07256444,-0.03036417,0.015653826,-0.005320386,-0.03349673,-0.019997267,0.15433863,0.050127257,-0.089225166,0.005630828,0.024522534,-0.0020969848,-0.026598861,0.007358446,0.003845374,-0.03284449,0.00023716928,0.07736911,0.011041466,-0.006022485,0.008865818,-0.068788074,0.030945094,0.053015236,-0.042841945,-0.043387324,0.027067047,0.012393502,-0.024872184,-0.024758197,-0.024249272,0.022111077,0.046460655,-0.065446265,0.056862876,-0.062122546,-0.04412098,-0.050787136,-0.04575691,-0.046283178,-0.021035235,-0.00875199,-0.03954109,0.039542545,0.018828766,-0.023910161,0.08799489,-0.010121309,-0.0039449534,0.0015115279,0.012285473,0.041349433,0.014511542,-0.053934015,0.038165446,0.053309307,-0.043194123,-0.009328301,-0.03958016,0.021930065,0.05189564,0.0015534075,0.06241471,0.0010343177,-0.027613996,-0.024257738,-0.20397201,-0.007233349,-0.014428013,-0.017902214,0.06724665,-0.045921907,0.029662227,0.0016718816,0.0047531873,0.05652138,0.105867885,0.0036533773,-0.06767854,0.052658122,-0.03904822,0.010790792,0.04553269,-0.040938087,-0.04405698,-0.010728236,-0.023136374,0.056206472,-0.031667244,-0.030998392,0.031630225,-0.002015384,0.19393496,0.024178464,0.018401537,0.019925117,0.013397816,0.04788161,-0.04176352,-0.13873242,0.072604805,0.03258547,-0.0631937,-0.01407566,-0.023740878,-0.05692861,0.013483185,0.012442443,-0.0016795025,-0.07024926,0.019922221,-0.02649033,-0.05433598,0.04643004,-0.05597594,-0.005010142,0.04554638,-0.015759835,0.030233422,0.06082351,0.03378702,-0.040286765,-0.041479524,0.024643956,0.0056266035,0.083881155,-0.011913224,-0.019788422,0.014466108,-0.050029382,0.04569646,-0.008412162,-0.046519782,-0.035972968,0.034843653,-0.0037177429,-0.0016786915,0.124281354,0.026072014,-0.06675323,0.06093841,0.031649556,-0.0015938239,0.0037048894,-0.015477866,-0.037646055,0.03183029,0.014023446,0.024981178,0.016747307,0.023812788,-0.04459748,0.04462608,0.005824712,-0.00092214526,-0.037604596,0.03230964,0.02134279,-0.062278356,-0.04742351,0.030824028,-0.009500195,-0.3206778,0.03206209,-0.0009744603,0.074710295,0.009849378,0.011338417,0.0309105,0.01694097,-0.10418144,0.0027646215,0.01652255,0.034567036,0.034840077,0.019726748,-0.020466022,0.05686796,0.031324863,-0.03094217,-0.01631775,-0.04270172,0.044950042,0.016875327,0.20993532,-0.008167604,0.0015456779,0.040081847,-0.0085548,0.03632057,0.018756906,-0.017911803,-0.019795503,-0.0012065303,0.09410427,-0.025484838,0.048249774,0.009357529,-0.044272527,0.02716772,0.02650604,-0.040598724,-0.04659074,-0.016950257,0.005459541,-0.031741723,0.10885958,-0.022004414,-0.061310977,-0.05130696,-0.015065959,0.083220616,-0.009885546,0.007848859,-0.058771376,0.018275056,0.034791514,0.01425599,-0.042259987,0.0070939437,-0.025511121,-0.023428308,-0.0047873002,0.0015214599,-0.019417668,0.033980027,0.027271133]	{"case_id": "Case C-272/19", "source_type": "operative_part", "processed_at": "2025-07-16T19:39:54.373Z", "has_simplified_text": true}	2025-07-16 19:39:54.470471+00	2025-07-16 19:39:54.470471+00
02c0c752-fcde-4388-b1a4-203234e65001		c85e9e43-c104-4e85-aa1b-0161d99587de		4. Article 12(3)(b) of Directive 2016/681 must be interpreted as precluding national legislation pursuant to which the authority put in place as the passenger information unit (PIU) is also designated as a competent national authority with power to approve the disclosure of PNR data upon expiry of the period of six months after the transfer of those data to the PIU.	[-0.0136525305,-0.011426198,0.0558771,-0.053584293,0.039624948,0.03187783,0.039985474,0.0015127778,-0.013315101,0.015419288,-0.031732894,-0.054886334,0.0007347536,0.044233944,0.0032453192,-0.007265756,-0.0010071512,0.01853274,0.011733989,0.043464497,0.06699004,-0.028887065,-0.03543838,0.016016888,0.05087559,0.06822728,-0.03847226,-0.030841205,-0.05715126,-0.19919376,-0.015102094,-0.068438664,0.012365616,-0.004920061,-0.014266544,-0.032788258,-0.0016744348,0.034074172,-0.01873424,0.054934084,0.050445575,0.01872728,-0.008592004,-0.07272745,-0.033637837,-0.009623075,-0.0135576315,-0.0036904365,0.03161742,-0.025184756,0.034863997,0.012309895,0.025143282,0.045220837,-0.0031273637,0.011852646,0.07530018,0.022985093,0.053071782,0.025802419,0.03766328,0.025709366,-0.24100351,0.04421593,0.017009078,0.05105886,-0.05870904,-0.056326564,-0.008515495,-0.015017228,-0.03946166,0.002868342,0.00813232,0.035542358,-0.0102515295,-0.02577272,-0.026615147,-0.011868362,0.0151178045,0.011525662,-0.0029770378,-0.0037910123,-0.03470016,-0.0027671105,-0.019440943,-0.050295267,0.007268563,-0.05074295,0.0050176494,0.00315462,0.015072123,-0.01693934,-0.0008795847,0.076538146,-0.032169946,-0.003810005,0.028778547,0.0110965455,-0.052332047,0.19995567,-0.043831892,0.04342589,-0.023069875,0.022477869,0.022649268,-0.010628122,0.041702744,-0.012607855,-0.020598877,-0.022112556,0.0015048864,-0.0030636438,0.04048773,-0.07613111,0.008491747,0.05427931,0.009025749,0.060240313,-0.01492402,-0.037707977,-0.0005420465,-0.013660762,0.012130798,0.0043627173,0.020511314,-0.05342963,0.10392207,0.09837802,0.0032132547,0.057658073,0.062054515,-0.051455446,-0.040474158,-0.031511024,-0.020907125,0.047732078,0.037860338,-0.007101457,-0.015838072,-0.008448369,-0.03714317,-0.1340902,-0.0040744976,-0.10026426,-0.019378722,0.14544915,-0.017160807,0.047357496,-0.059357185,0.015644781,-0.020529447,0.04837269,-0.04808793,-0.07582694,0.01952806,0.012662241,-0.009039368,0.0520088,-0.012384476,0.0320282,0.02141773,-0.041220076,-0.016324252,0.11143703,0.0057610325,-0.08517238,0.021034025,-0.012945936,0.04513622,-0.039789055,-0.004853866,0.02380619,-0.05125223,-0.020749269,0.075764894,0.014270813,0.0120739,0.017485078,-0.06385573,0.013211055,0.0114251925,-0.061343428,-0.009382362,0.042803537,0.010725935,-0.022139685,-0.048586305,-0.051225584,0.013198858,0.0462581,-0.056641612,0.053533703,-0.04780821,0.0036580504,-0.035534527,-0.054569416,-0.06888915,-0.038613096,-0.017427081,-0.052865505,0.061714914,-0.016359618,-0.03825824,0.035243478,-0.014212123,0.036857832,-0.009322717,0.001183941,0.009429072,0.0010394951,-0.044056688,0.016671645,0.04782352,-0.0334661,-0.021959942,0.007401485,0.01091474,0.02069884,0.038627964,0.060634494,0.019581234,-0.020044379,0.007972614,-0.21013932,0.023137674,0.006888611,-0.029270062,0.066858456,-0.043949395,0.03837342,-0.010741007,0.019672895,0.03794213,0.08751674,0.008805186,-0.043481275,0.03316017,-0.0037474735,0.047681727,0.038559105,-0.008153378,-0.030221008,0.020647893,-0.03019935,0.03526796,-0.041126013,-0.03721234,0.057353564,-0.0045874678,0.17685495,-0.00925548,-1.5481632e-05,0.00054909015,0.05115333,0.00016512258,-0.07480691,-0.12401562,0.062473394,0.004113281,-0.02308782,0.0071631162,-0.04302135,-0.060370892,0.015011651,0.050863534,-0.008142191,-0.08155045,-0.02805943,-0.042558227,-0.05332429,0.024305517,-0.047818765,0.030755026,0.03743597,-0.012404268,0.023116652,0.05594066,0.019550685,-0.06013415,-0.043856442,0.03201274,0.00020093925,0.071190946,-0.035486802,-0.04138531,0.041123595,-0.038693316,0.031485733,0.014000374,-0.05224362,0.0054167015,0.01584411,-0.009417144,-0.039656475,0.14691526,-0.020345895,-0.06509987,0.09228553,0.027511612,0.029735249,0.021816062,0.007907011,-0.030165201,0.041313022,-0.048539188,0.019885855,0.055159304,0.033707898,0.009107963,0.052920666,0.020880602,-0.010213707,-0.012518726,0.015469439,0.03499629,-0.04452518,-0.042395387,0.032078546,-0.033726837,-0.32883626,0.016206771,0.011572074,0.0138130905,0.010718162,0.036320534,0.017511465,0.020461686,-0.11817055,0.03298771,0.03539213,0.023375668,0.035038892,-0.034584943,0.018219003,0.049159043,0.057437353,-0.040949896,0.009169684,-0.033056274,0.01465898,-0.02010568,0.20847318,0.008246112,0.016825965,0.01835108,-0.013169397,0.040042326,0.016483987,-0.010611186,-0.020309199,0.0021996514,0.09726265,-0.026306551,0.02357347,0.018946512,-0.08040794,0.06609845,0.035032403,-0.040020283,-0.08947901,-0.032319374,-0.009407478,-0.019811247,0.12434011,-0.012678537,-0.072949104,-0.041645005,0.019699834,0.056148518,-0.017484944,-0.019470435,-0.043606784,0.0138361305,0.02791505,0.04117435,-0.034631696,-0.054314617,-0.0025930943,-0.025743105,0.028592104,-0.017281635,-0.030833205,0.07032935,0.027564056]	{"case_id": "Case C-817/19", "source_type": "operative_part", "processed_at": "2025-07-16T19:40:45.534Z", "has_simplified_text": true}	2025-07-16 19:40:45.681346+00	2025-07-16 19:40:45.681346+00

### case_laws

title	court	date_of_judgment	parties	summary_text	html_content_link	plaintext_content_link	source_url	created_at	updated_at	operative_parts_combined	operative_parts_individual	html_content	plaintext_content
Case C-673/17: Bundesverband der Verbraucherzentralen und Verbraucherverb√§nde - Interpretation of Article 6(1)(a) and Article 7 GDPR	CJEU		Bundesverband der Verbraucherzentralen und Verbraucherverb√§nde v Planet49 GmbH					2025-07-16 19:47:00.435777+00	2025-07-16 19:47:00.435777+00	Article 3(d) of Regulation (EC) No 469/2009 of the European Parliament and of the Council of 6 May 2009 concerning the supplementary protection certificate for medicinal products must be interpreted as meaning that a marketing authorisation cannot be considered to be the first marketing authorisation, for the purpose of that provision, where it covers a new therapeutic application of an active ingredient, or of a combination of active ingredients, and that active ingredient or combination has already been the subject of a marketing authorisation for a different therapeutic application.		<HTML>....</HTML>	This ruling establishes....
Case C-710/23: Mgr. L. H. v Ministerstvo zdravotnictv√≠	CJEU	4/3/25	Mgr. L. H. v Ministerstvo zdravotnictv√≠					2025-07-16 19:46:58.772323+00	2025-07-16 19:46:58.772323+00	1. **Points 1 and 2 of Article 4 of Regulation (EU) 2016/679 of the European Parliament and of the Council of 27 April 2016 on the protection of natural persons with regard to the processing of personal data and on the free movement of such data, and repealing Directive 95/46/EC (General Data Protection Regulation)		<HTML>....</HTML>	This ruling establishes....

### articles

|   |   |   |   |   |   |   |   |   |
|---|---|---|---|---|---|---|---|---|
|id|legislation_id|article_number_text|title|filename|markdown_content|created_at|updated_at|article_number|
|0e0d33a0-70ef-4bc9-905a-19486e7a3576|f0c9fff0-5eb5-46eb-8bf7-5ae718dd6327|7|Article 7|Article 7.md|---  <br>celex: "32001R0044"  <br>article: 7  <br>title: "Article 7"  <br>document_title: "32001R0044"  <br>document_type: "legislation"  <br>---  <br>  <br>## Article 7  <br>  <br>## Article 7  <br>  <br>Where by virtue of this Regulation a court of a Member State has jurisdiction in actions relating to liability from the use or operation of a ship, that court, or any other court substituted for this purpose by the internal law of that Member State, shall also have jurisdiction over claims for limitation of such liability.  <br>  <br>Section 3  <br>  <br>Jurisdiction in matters relating to insurance|2025-07-02 20:28:39.700819+00|2025-07-02 20:28:39.700819+00|7|
|c44844e9-e28c-4952-b828-dda44a24c9c5|be950a32-be39-4713-ab12-a095ca87a5f3|70|Article 70|Article 70.md|---  <br>celex: "32016R0679"  <br>article: 70  <br>title: "Article 70"  <br>document_title: "32016R0679"  <br>document_type: "legislation"  <br>---  <br>  <br>## Tasks of the Board  <br>  <br>1.¬†¬†¬†The Board shall ensure the consistent application of this Regulation. To that end, the Board shall, on its own initiative or, where relevant, at the request of the Commission, in particular:  <br>  <br>(a) monitor and ensure the correct application of this Regulation in the cases provided for in Articles 64 and 65 without prejudice to the tasks of national supervisory authorities;  <br>  <br>(b) advise the Commission on any issue related to the protection of personal data in the Union, including on any proposed amendment of this Regulation;  <br>  <br>(c) advise the Commission on the format and procedures for the exchange of information between controllers, processors and supervisory authorities for binding corporate rules;  <br>  <br>(d) issue guidelines, recommendations, and best practices on procedures for erasing links, copies or replications of personal data from publicly available communication services as referred to in Article 17(2);  <br>  <br>(e) examine, on its own initiative, on request of one of its members or on request of the Commission, any question covering the application of this Regulation and issue guidelines, recommendations and best practices in order to encourage consistent application of this Regulation;  <br>  <br>(f) issue guidelines, recommendations and best practices in accordance with point¬†(e) of this paragraph for further specifying the criteria and conditions for decisions based on profiling pursuant to Article 22(2);  <br>  <br>(g) issue guidelines, recommendations and best practices in accordance with point¬†(e) of this paragraph for establishing the personal data breaches and determining the undue delay referred to in Article 33(1) and (2) and for the particular circumstances in which a controller or a processor is required to notify the personal data breach;  <br>  <br>(h) issue guidelines, recommendations and best practices in accordance with point¬†(e) of this paragraph as to the circumstances in which a personal data breach is likely to result in a high risk to the rights and freedoms of the natural persons referred to in Article 34(1).  <br>  <br>(i) issue guidelines, recommendations and best practices in accordance with point¬†(e) of this paragraph for the purpose of further specifying the criteria and requirements for personal data transfers based on binding corporate rules adhered to by controllers and binding corporate rules adhered to by processors and on further necessary requirements to ensure the protection of personal data of the data subjects concerned referred to in Article 47;  <br>  <br>(j) issue guidelines, recommendations and best practices in accordance with point¬†(e) of this paragraph for the purpose of further specifying the criteria and requirements for the personal data transfers on the basis of Article 49(1);  <br>  <br>(k) draw up guidelines for supervisory authorities concerning the application of measures referred to in Article 58(1), (2) and (3) and the setting of administrative fines pursuant to Article 83;  <br>  <br>(l) review the practical application of the guidelines, recommendations and best practices referred to in points (e) and¬†(f);  <br>  <br>(m) issue guidelines, recommendations and best practices in accordance with point¬†(e) of this paragraph for establishing common procedures for reporting by natural persons of infringements of this Regulation pursuant to Article 54(2);  <br>  <br>(n) encourage the drawing-up of codes of conduct and the establishment of data protection certification mechanisms and data protection seals and marks pursuant to Articles 40 and 42;  <br>  <br>(o) carry out the accreditation of certification bodies and its periodic review pursuant to Article 43 and maintain a public register of accredited bodies pursuant to Article¬†43(6) and of the accredited controllers or processors established in third countries pursuant to Article 42(7);  <br>  <br>(p) specify the requirements referred to in Article 43(3) with a view to the accreditation of certification bodies under Article 42;  <br>  <br>(q) provide the Commission with an opinion on the certification requirements referred to in Article 43(8);  <br>  <br>(r) provide the Commission with an opinion on the icons referred to in Article¬†12(7);  <br>  <br>(s) provide the Commission with an opinion for the assessment of the adequacy of the level of protection in a third country or international organisation, including for the assessment whether a third country, a territory or one or more specified sectors within that third country, or an international organisation no longer ensures an adequate level of protection. To that end, the Commission shall provide the Board with all necessary documentation, including correspondence with the government of the third country, with regard to that third country, territory or specified sector, or with the international organisation.  <br>  <br>(t) issue opinions on draft decisions of supervisory authorities pursuant to the consistency mechanism referred to in Article 64(1), on matters submitted pursuant to Article 64(2) and to issue binding decisions pursuant to Article 65, including in cases referred to in Article 66;  <br>  <br>(u) promote the cooperation and the effective bilateral and multilateral exchange of information and best practices between the supervisory authorities;  <br>  <br>(v) promote common training programmes and facilitate personnel exchanges between the supervisory authorities and, where appropriate, with the supervisory authorities of third countries or with international organisations;  <br>  <br>(w) promote the exchange of knowledge and documentation on data protection legislation and practice with data protection supervisory authorities worldwide.  <br>  <br>(x) issue opinions on codes of conduct drawn up at Union level pursuant to Article¬†40(9); and  <br>  <br>(y) maintain a publicly accessible electronic register of decisions taken by supervisory authorities and courts on issues handled in the consistency mechanism.  <br>  <br>2.¬†¬†¬†Where the Commission requests advice from the Board, it may indicate a time limit, taking into account the urgency of the matter.  <br>  <br>3.¬†¬†¬†The Board shall forward its opinions, guidelines, recommendations, and best practices to the Commission and to the committee referred to in Article 93 and make them public.  <br>  <br>4.¬†¬†¬†The Board shall, where appropriate, consult interested parties and give them the opportunity to comment within a reasonable period. The Board shall, without prejudice to Article 76, make the results of the consultation procedure publicly available.|2025-07-16 19:39:20.98919+00|2025-07-16 19:39:20.98919+00|70|
### case_law_interprets_article

id	case_law_id	article_id	created_at
ddf3e4e5-fcab-410e-8b32-821e170f14ee	5eec622b-cd86-423a-9f35-4a36f5c5c24a	c60b0ec9-57b0-4be1-98f4-f3b15abfefe1	2025-07-16 19:47:02.475873+00
405fd1c8-d2ff-4c39-8678-996b1fea6b05	0590e8c4-2ff3-4f56-bf4a-6aa13725354b	6b65e0a8-c0d2-4a0e-a9ac-143a51e47378	2025-07-16 19:46:58.683356+00
