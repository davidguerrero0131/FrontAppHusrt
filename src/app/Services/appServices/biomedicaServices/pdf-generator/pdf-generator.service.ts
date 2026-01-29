import { Injectable, inject } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FirmaService } from '../firma/firma.service';

@Injectable({
    providedIn: 'root'
})
export class PdfGeneratorService {

    private firmaService = inject(FirmaService);

    constructor() { }

    async generateReportePreventivo(reporte: any) {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;
        const margin = 10;
        let finalY = margin;

        // Load Logo
        let logoImg = null;
        try {
            logoImg = await this.loadImage('LogoAgora.png');
        } catch (e) {
            console.error('Could not load logo', e);
        }

        // Colores
        const colorTeal = [0, 150, 136]; // #009688
        const colorWhite = [255, 255, 255];
        const colorBlack = [0, 0, 0];

        // Helper para encabezados de sección
        const addSectionHeader = (text: string, y: number) => {
            doc.setFillColor(colorTeal[0], colorTeal[1], colorTeal[2]);
            doc.rect(margin, y, pageWidth - (margin * 2), 7, 'F');
            doc.setTextColor(colorWhite[0], colorWhite[1], colorWhite[2]);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.text(text.toUpperCase(), pageWidth / 2, y + 5, { align: 'center' });
            doc.setTextColor(colorBlack[0], colorBlack[1], colorBlack[2]); // Reset text color
            return y + 8;
        };

        // --- ENCABEZADO PRINCIPAL ---

        autoTable(doc, {
            body: [
                [
                    { content: 'E.S.E. HOSPITAL UNIVERSITARIO SAN RAFAEL DE TUNJA', colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } },
                    { content: '', rowSpan: 2, styles: { halign: 'center', valign: 'middle', minCellHeight: 15 } } // Content empty, will draw image over
                ],
                [
                    { content: 'CÓDIGO: IB-F-24\nVersión: 003', styles: { halign: 'center', fontSize: 8 } },
                    { content: 'REPORTE DE MANTENIMIENTO PREVENTIVO DE TECNOLOGÍAS BIOMÉDICAS', styles: { halign: 'center', valign: 'middle', fontStyle: 'bold', fontSize: 10 } }
                ]
            ],
            styles: {
                lineWidth: 0.1,
                lineColor: [0, 0, 0],
                textColor: colorBlack,
                fontSize: 10
            },
            headStyles: {
                fillColor: colorWhite,
                textColor: colorBlack
            },
            theme: 'plain',
            startY: margin,
            margin: { left: margin, right: margin },
            columnStyles: {
                2: { cellWidth: 30 } // Adjust width for logo column if needed, though autotable structure here is 2 cols? No 3 cols effectively in row 1?
                // Actually row 1 has 2 cells: cell 1 colspan 2. cell 2 rowspan 2. 
                // Wait, logic: row 1: [Col 1+2], [Col 3]. row 2: [Col 1], [Col 2]. 
                // But row 2 matches row 1 cols? 
                // Let's redefine body for clarity. 3 columns total.
                // Row 1: Cell A (colspan 2), Cell B (rowspan 2, logo).
                // Row 2: Cell C, Cell D.
                // Cell C and D should align with Cell A.
            },
            didDrawCell: (data: any) => {
                if (data.section === 'body' && data.row.index === 0 && data.column.index === 1 && logoImg) {
                    // This is the logo cell (index 1 because index 0 is the colspan one?)
                    // Autotable is tricky with spans.
                    // Let's just draw image at fixed coordinates for simplicity if table is hard.
                }
            }
        });

        // Better approach for Logo: Draw table, then draw image over the cell.
        // Or simpler: 3 columns.
        // Col 1: Code/Version. Col 2: Title. Col 3: Logo.
        // Image shows: Code/Version | Title | Logo (Top right).
        // Actually image 1 shows:
        // Row 1: "E.S.E. HOSPITAL..." (Colspan 2) | Logo (Rowspan 2) ?
        // Row 2: "CODIGO..." | "REPORTE..." | (Logo continues)
        // Actually looks like:
        // Cell 1 (Rowspan 2): Code/Version
        // Cell 2 (Rowspan 1): Hospital Name
        // Cell 3 (Rowspan 2): Logo
        // Row 2 Cell 2: Report Title.

        // Let's approximate.

        if (logoImg) {
            doc.addImage(logoImg, 'PNG', pageWidth - margin - 35, margin + 2, 30, 15);
        }

        // Try to add logo over the placeholder if possible, skipping for now to prioritize layout.
        finalY = (doc as any).lastAutoTable.finalY;

        // --- 1. INFORMACIÓN GENERAL DEL EQUIPO ---
        finalY += 5;
        finalY = addSectionHeader('1. INFORMACIÓN GENERAL DEL EQUIPO', finalY);

        autoTable(doc, {
            body: [
                [
                    { content: 'NOMBRE DE LA TECNOLOGÍA:', styles: { fontStyle: 'bold' } }, reporte.equipo.nombres,
                    { content: 'MARCA:', styles: { fontStyle: 'bold' } }, reporte.equipo.marca
                ],
                [
                    { content: 'MODELO:', styles: { fontStyle: 'bold' } }, reporte.equipo.modelo,
                    { content: 'SERIE:', styles: { fontStyle: 'bold' } }, reporte.equipo.serie,
                    { content: 'CÓDIGO INTERNO:', styles: { fontStyle: 'bold' } }, reporte.equipo.placa
                ],
                [
                    { content: 'SEDE:', styles: { fontStyle: 'bold' } }, reporte.servicio.sede?.nombres || 'Sin Sede',
                    { content: 'SERVICIO:', styles: { fontStyle: 'bold' } }, reporte.servicio.nombres
                ]
            ],
            styles: { fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: [0, 0, 0] },
            theme: 'grid',
            startY: finalY,
            margin: { left: margin, right: margin }
        });
        finalY = (doc as any).lastAutoTable.finalY;

        // --- 2. INFORMACIÓN GENERAL DEL MANTENIMIENTO ---
        finalY += 5;
        finalY = addSectionHeader('2. INFORMACIÓN GENERAL DEL MANTENIMIENTO', finalY);

        autoTable(doc, {
            body: [
                [
                    { content: 'FECHA DE LA ACTIVIDAD:', styles: { fontStyle: 'bold' } }, reporte.fechaRealizado,
                    { content: 'N° REPORTE:', styles: { fontStyle: 'bold' } }, reporte.id
                ],
                [
                    { content: 'HORA INICIO:', styles: { fontStyle: 'bold' } }, reporte.horaInicio,
                    { content: 'HORA FIN:', styles: { fontStyle: 'bold' } }, reporte.horaTerminacion
                ]
            ],
            styles: { fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: [0, 0, 0] },
            theme: 'grid',
            startY: finalY,
            margin: { left: margin, right: margin }
        });
        finalY = (doc as any).lastAutoTable.finalY;


        // --- 3. VERIFICACIÓN DE CONDICIONES INICIALES ---
        finalY += 5;
        finalY = addSectionHeader('3. VERIFICACIÓN DE CONDICIONES INICIALES', finalY);

        const condicionesBody = reporte.cumplimientoCondicionesIniciales ? reporte.cumplimientoCondicionesIniciales.map((c: any) => [
            c.condicionInicial?.descripcion || 'Condición',
            c.cumple === 'CUMPLE' ? 'CUMPLE' : (c.cumple === 'NO_CUMPLE' ? 'NO CUMPLE' : (c.cumple === 'NO_APLICA' ? 'NO APLICA' : 'NO')),
            c.observacion || ''
        ]) : [];

        if (condicionesBody.length > 0) {
            autoTable(doc, {
                head: [['CONDICIÓN', 'CUMPLIMIENTO', 'OBSERVACIONES']],
                body: condicionesBody,
                styles: { fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: [0, 0, 0] },
                headStyles: { fillColor: colorWhite, textColor: colorBlack, fontStyle: 'bold', halign: 'center' },
                theme: 'grid',
                startY: finalY,
                margin: { left: margin, right: margin },
                columnStyles: {
                    0: { cellWidth: 80 },
                    1: { cellWidth: 30, halign: 'center' },
                    2: { cellWidth: 'auto' }
                }
            });
            finalY = (doc as any).lastAutoTable.finalY + 2;
        } else {
            doc.setFontSize(8);
            doc.text('No se registraron condiciones iniciales.', margin, finalY + 5);
            finalY += 10;
        }

        // --- 4. PROTOCOLO PREVENTIVO ---
        finalY = addSectionHeader('4. PROTOCOLO PREVENTIVO', finalY);

        const protocolBody = reporte.cumplimientoProtocolo ? reporte.cumplimientoProtocolo.map((p: any) => [
            p.protocolo?.paso || p.paso || 'Paso',
            p.cumple === 'CUMPLE' ? 'CUMPLE' : (p.cumple === 'NO_CUMPLE' ? 'NO CUMPLE' : (p.cumple === 'NO_APLICA' ? 'NO APLICA' : 'NO')),
            p.observaciones || ''
        ]) : [];

        if (protocolBody.length > 0) {
            autoTable(doc, {
                head: [['ACTIVIDAD / PASO', 'CUMPLIMIENTO', 'OBSERVACIONES']],
                body: protocolBody,
                styles: { fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: [0, 0, 0] },
                headStyles: { fillColor: colorWhite, textColor: colorBlack, fontStyle: 'bold', halign: 'center' },
                theme: 'grid',
                startY: finalY,
                margin: { left: margin, right: margin },
                columnStyles: {
                    0: { cellWidth: 80 },
                    1: { cellWidth: 30, halign: 'center' },
                    2: { cellWidth: 'auto' }
                }
            });
            finalY = (doc as any).lastAutoTable.finalY + 2;
        } else {
            doc.setFontSize(8);
            doc.text('No se registró protocolo preventivo.', margin, finalY + 5);
            finalY += 10;
        }


        // --- 5. MEDICIONES Y PRUEBAS ESPECÍFICAS ---
        if (reporte.valoresMediciones && reporte.valoresMediciones.length > 0) {
            finalY = addSectionHeader('5. MEDICIONES Y PRUEBAS ESPECÍFICAS (Si aplica)', finalY);

            // Patron Info
            const patronInfo = reporte.equipoPatronIdFk ? [
                [
                    { content: 'NOMBRE DEL EQUIPO PATRÓN:', styles: { fontStyle: 'bold' } }, reporte.equipoPatron?.nombres || 'N/A',
                    { content: 'MARCA:', styles: { fontStyle: 'bold' } }, reporte.equipoPatron?.marca || 'N/A',
                    { content: 'MODELO:', styles: { fontStyle: 'bold' } }, reporte.equipoPatron?.modelo || 'N/A'
                ],
                [
                    { content: 'SERIE:', styles: { fontStyle: 'bold' } }, reporte.equipoPatron?.serie || 'N/A',
                    { content: 'FECHA DE CALIBRACIÓN:', styles: { fontStyle: 'bold' } }, 'N/A',
                    { content: 'N° CERT:', styles: { fontStyle: 'bold' } }, 'N/A'
                ]
            ] : [['No aplica Equipo Patrón', '', '', '', '', '']];

            if (reporte.equipoPatronIdFk) {
                autoTable(doc, {
                    body: patronInfo,
                    styles: { fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: [0, 0, 0] },
                    theme: 'grid',
                    startY: finalY,
                    margin: { left: margin, right: margin }
                });
                finalY = (doc as any).lastAutoTable.finalY + 5;
            }

            const medicionesBody = reporte.valoresMediciones.map((m: any, index: number) => [
                index + 1,
                m.medicion?.nombre || 'Parámetro',
                m.medicion?.valorEstandar || '-',
                m.medicion?.unidad || '-',
                m.valor,
                m.unidadRegistrada || m.medicion?.unidad || '-',
                m.medicion?.criterioAceptacion || '-',
                m.conforme ? 'SI' : 'NO'
            ]);

            autoTable(doc, {
                head: [['ÍTEM', 'PARÁMETRO', 'VALOR ESTÁNDAR', 'UNIDAD', 'VALOR MEDIDO', 'UNIDAD', 'CRITERIO DE ACEPTACIÓN', 'CONFORME']],
                body: medicionesBody,
                styles: { fontSize: 7, cellPadding: 1, lineWidth: 0.1, lineColor: [0, 0, 0], halign: 'center' },
                headStyles: { fillColor: [50, 0, 100], textColor: colorWhite, fontStyle: 'bold' },
                theme: 'grid',
                startY: finalY,
                margin: { left: margin, right: margin }
            });
            finalY = (doc as any).lastAutoTable.finalY;
        }

        // --- 6. REPUESTOS Y ACCESORIOS UTILIZADOS ---
        finalY += 5;
        finalY = addSectionHeader('6. REPUESTOS Y ACCESORIOS UTILIZADOS O CAMBIADOS', finalY);

        const repuestosBody = reporte.repuestos ? reporte.repuestos.map((r: any, i: number) => [
            i + 1,
            r.nombreInsumo,
            r.cantidad,
            r.comprobanteEgreso || '-'
        ]) : [['-', '-', '-', '-']];

        autoTable(doc, {
            head: [['ITEM', 'DESCRIPCIÓN', 'CANTIDAD', 'COMPROBANTE EGRESO']],
            body: repuestosBody,
            styles: { fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: [0, 0, 0] },
            theme: 'grid',
            startY: finalY,
            margin: { left: margin, right: margin }
        });
        finalY = (doc as any).lastAutoTable.finalY + 2;


        // --- 7. ESTADO FINAL DEL EQUIPO ---
        finalY = addSectionHeader('7. ESTADO FINAL DEL EQUIPO', finalY);

        const estado = reporte.estadoOperativo || 'Operativo sin restricciones';
        const isSinRestriccion = estado === 'Operativo sin restricciones' ? 'X' : '';
        const isConRestriccion = estado === 'Operativo con restricciones' ? 'X' : '';
        const isFueraServicio = estado === 'Fuera de servicio' ? 'X' : '';

        const calif = parseInt(reporte.calificacion) || 0;
        const is0_20 = calif === 1 ? 'X' : '';
        const is21_40 = calif === 2 ? 'X' : '';
        const is41_60 = calif === 3 ? 'X' : '';
        const is61_80 = calif === 4 ? 'X' : '';
        const is81_100 = calif === 5 ? 'X' : '';

        autoTable(doc, {
            body: [
                [
                    { content: 'ESTADO DEL EQUIPO', styles: { fontStyle: 'bold', halign: 'center', fillColor: [240, 240, 240] } },
                    { content: 'ESTADO EN NÚMEROS', styles: { fontStyle: 'bold', halign: 'center', fillColor: [240, 240, 240] } }
                ],
                ['Operativo sin restricciones  [' + isSinRestriccion + ']', '0% - 20%   [' + is0_20 + ']'],
                ['Operativo con restricciones   [' + isConRestriccion + ']', '21% - 40%  [' + is21_40 + ']'],
                ['Fuera de servicio             [' + isFueraServicio + ']', '41% - 60%  [' + is41_60 + ']'],
                ['', '61% - 80%  [' + is61_80 + ']'],
                ['', '81% - 100% [' + is81_100 + ']']
            ],
            styles: { fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: [0, 0, 0] },
            theme: 'grid',
            startY: finalY,
            margin: { left: margin, right: margin },
            columnStyles: {
                0: { cellWidth: pageWidth / 2 - margin },
                1: { cellWidth: pageWidth / 2 - margin }
            }
        });
        finalY = (doc as any).lastAutoTable.finalY;

        // --- 8. OBSERVACIONES GENERALES ---
        finalY += 5;
        finalY = addSectionHeader('8. OBSERVACIONES GENERALES', finalY);

        autoTable(doc, {
            body: [[reporte.observaciones || 'Sin observaciones']],
            styles: { fontSize: 8, cellPadding: 2, lineWidth: 0.1, lineColor: [0, 0, 0] },
            theme: 'plain',
            startY: finalY,
            margin: { left: margin, right: margin }
        });
        finalY = (doc as any).lastAutoTable.finalY;

        // --- 9. FIRMAS DE CONFORMIDAD ---
        if (finalY > 220) { // Ensure enough space
            doc.addPage();
            finalY = margin;
        } else {
            finalY += 5;
        }

        finalY = addSectionHeader('9. FIRMAS DE CONFORMIDAD', finalY);

        // Fetch Technician Signature
        let firmaTecnicoImg = null;
        if (reporte.usuario && reporte.usuario.id) {
            try {
                const blob = await this.firmaService.getFirmaImage(reporte.usuario.id);
                if (blob) {
                    const reader = new FileReader();
                    firmaTecnicoImg = await new Promise((resolve) => {
                        reader.onloadend = () => resolve(reader.result);
                        reader.readAsDataURL(blob);
                    });
                }
            } catch (e) {
                console.error('Error fetching signature', e);
            }
        }

        const ySignatures = finalY + 10;
        const colWidth = (pageWidth - (margin * 2)) / 2;
        const signatureHeight = 25;
        const signatureWidth = 60;

        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');

        // Left side: Technician
        doc.text('GESTIÓN DE LA TECNOLOGÍA BIOMÉDICA', margin + (colWidth / 2), ySignatures, { align: 'center' });

        doc.setFont('helvetica', 'normal');
        doc.text('Nombre: ' + (reporte.usuario?.nombres || '') + ' ' + (reporte.usuario?.apellidos || ''), margin + 5, ySignatures + 10);
        doc.text('Cargo: ' + (reporte.usuario?.cargo?.nombre || 'BIOMÉDICO'), margin + 5, ySignatures + 16);

        if (firmaTecnicoImg) {
            // Centered signature image
            const xSig = margin + (colWidth - signatureWidth) / 2;
            doc.addImage(firmaTecnicoImg as string, 'PNG', xSig, ySignatures + 20, signatureWidth, signatureHeight);
        }

        doc.line(margin + 5, ySignatures + 48, margin + colWidth - 5, ySignatures + 48);
        doc.text('Firma', margin + (colWidth / 2), ySignatures + 53, { align: 'center' });


        // Right side: Receiver
        const xRight = margin + colWidth;
        doc.setFont('helvetica', 'bold');
        doc.text('SERVICIO ASISTENCIAL', xRight + (colWidth / 2), ySignatures, { align: 'center' });

        doc.setFont('helvetica', 'normal');
        doc.text('Nombre: ' + (reporte.nombreRecibio || ''), xRight + 5, ySignatures + 10);
        doc.text('Cedula: ' + (reporte.cedulaRecibio || ''), xRight + 5, ySignatures + 16);

        doc.line(xRight + 5, ySignatures + 48, xRight + colWidth - 5, ySignatures + 48);
        doc.text('Firma', xRight + (colWidth / 2), ySignatures + 53, { align: 'center' });

        // Draw box around signatures
        doc.rect(margin, finalY, pageWidth - (margin * 2), 60);
        doc.line(margin + colWidth, finalY, margin + colWidth, finalY + 60);

        // Save
        doc.save(`Reporte_Preventivo_${reporte.id}.pdf`);
    }
    private async loadImage(url: string): Promise<string | null> {
        return null;
        /*
         try {
             const response = await fetch(url);
             const blob = await response.blob();
             return new Promise((resolve) => {
                 const reader = new FileReader();
                 reader.onloadend = () => resolve(reader.result as string);
                 reader.readAsDataURL(blob);
             });
         } catch (e) {
             console.error('Error loading image', e);
             return null;
         }
         */
    }
}
