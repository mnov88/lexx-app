# ReportBuilder Component Family

## Overview

The `ReportBuilder` component and its children (`ReportConfiguration`, `ReportPreview`) provide a complete workflow for generating professional legal research reports. This feature allows users to select specific legislations and articles, configure the report's content and format, and then preview and download the final report.

- **File**: `lexx-app/src/components/reports/ReportBuilder.tsx`
- **Children**:
    - `ReportConfiguration.tsx`: A detailed form for configuring the report.
    - `ReportPreview.tsx`: A component for previewing the generated report.

## Architecture

The `ReportBuilder` component is the main container that manages the state of the report generation process. It has two main steps: "configure" and "preview". It fetches the list of available legislations and passes it to the `ReportConfiguration` component. When the user generates a report, `ReportBuilder` calls the `/api/reports/generate` endpoint and then passes the generated data to the `ReportPreview` component.

## `ReportBuilder.tsx`

### Functionality

- **State Management**: Manages the current step of the report generation process (`configure` or `preview`), the report configuration, and the generated report data.
- **Data Fetching**: Fetches the list of available legislations from the `/api/legislations` endpoint.
- **Report Generation**: Calls the `/api/reports/generate` endpoint to generate the report data based on the user's configuration.
- **Report Download**: Calls the `/api/reports/download` endpoint to download the generated report as an HTML or PDF file.

## `ReportConfiguration.tsx`

### Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `config` | `ReportConfig` | ✅ | The current configuration of the report. |
| `setConfig` | `(config: ReportConfig) => void` | ✅ | A function to update the report configuration. |
| `legislations` | `Legislation[]` | ✅ | The list of available legislations. |
| `onGenerate` | `() => void` | ✅ | A function to be called when the user clicks the "Generate Report" button. |
| `isGenerating`| `boolean` | ✅ | A flag to indicate if the report is currently being generated. |

### Functionality

- **Configuration Form**: Provides a detailed form for users to configure the report, including the title, description, template, and format.
- **Content Selection**: Allows users to select which legislations and articles to include in the report.
- **Dynamic Article Loading**: Fetches the articles for the selected legislations from the `/api/legislations/[id]/articles` endpoint.
- **Content Options**: Provides checkboxes to include or exclude article text, operative parts, and case summaries.

## `ReportPreview.tsx`

### Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `reportData` | `ReportData` | ✅ | The data for the generated report. |
| `onDownloadHtml` | `() => void` | ✅ | A function to be called when the user clicks the "Download HTML" button. |
| `onDownloadPdf` | `() => void` | ✅ | A function to be called when the user clicks the "Download PDF" button. |

### Functionality

- **Report Summary**: Displays a summary of the generated report, including the number of legislations, articles, and cases included.
- **Configuration Overview**: Shows the configuration that was used to generate the report.
- **Content Preview**: Provides a high-level preview of the report's content structure.
- **Download Actions**: Provides buttons to download the report as an HTML or PDF file.

## Usage Example

```tsx
// In lexx-app/src/app/reports/page.tsx
import { ReportBuilder } from '@/components/reports/ReportBuilder'

export default function ReportsPage() {
  return <ReportBuilder />
}
``` 