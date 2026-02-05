import { Injectable, inject } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FirmaService } from '../firma/firma.service';
import { ImagenesService } from '../../general/imagenes/imagenes.service';

@Injectable({
    providedIn: 'root'
})
export class PdfGeneratorService {

    private firmaService = inject(FirmaService);
    private imagenesService = inject(ImagenesService);

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
        doc.line(xRight + 5, ySignatures + 48, xRight + colWidth - 5, ySignatures + 48);
        doc.text('Firma', xRight + (colWidth / 2), ySignatures + 53, { align: 'center' });

        // Draw box around signatures
        doc.rect(margin, finalY, pageWidth - (margin * 2), 60);
        doc.line(margin + colWidth, finalY, margin + colWidth, finalY + 60);

        // Save
        doc.save(`Reporte_Preventivo_${reporte.id}.pdf`);
    }



    async generateHojaVida(hojaVida: any, documentos: any[], planMantenimiento: any[], planMetrologia: any[]) {
        const doc = new jsPDF('l', 'mm', 'a4'); // Landscape orientation
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
        const margin = 10;
        let finalY = margin;

        // Load Logo/Photo
        let logoImg = null;
        try {
            // Find logo in root
            logoImg = await this.loadImage('/LogoAgora.png');
            if (!logoImg) {
                // Fallback
                logoImg = await this.loadImage('LogoAgora.png');
            }
        } catch (e) {
            console.error('Could not load logo', e);
        }

        let equipoImg = null;
        if (hojaVida.foto) {
            try {
                const blob = await this.imagenesService.getImagen(hojaVida.foto);
                const base64 = await this.blobToBase64(blob);
                equipoImg = base64;
            } catch (e) {
                console.error('Could not load equipo photo', e);
            }
        }

        // --- ENCABEZADO ---
        autoTable(doc, {
            body: [
                [
                    { content: 'CÓDIGO: IB-F-13', styles: { halign: 'center', valign: 'middle', fontSize: 8, fontStyle: 'bold' } },
                    { content: 'E.S.E. HOSPITAL UNIVERSITARIO SAN RAFAEL DE TUNJA', styles: { halign: 'center', valign: 'middle', fontSize: 11, fontStyle: 'bold' } },
                    { content: '', styles: { halign: 'center', valign: 'middle', minCellHeight: 15 } } // Logo placeholder left empty
                ],
                [
                    { content: 'Versión: 006', styles: { halign: 'center', valign: 'middle', fontSize: 8, fontStyle: 'bold' } },
                    { content: 'HOJA DE VIDA DE TECNOLOGÍA BIOMÉDICA', styles: { halign: 'center', valign: 'middle', fontSize: 10, fontStyle: 'bold' } },
                    { content: 'Fecha: 01/02/2026', styles: { halign: 'center', valign: 'middle', fontSize: 8, fontStyle: 'bold' } }
                ]
            ],
            theme: 'grid',
            styles: {
                lineColor: [0, 0, 0],
                lineWidth: 0.1, // Simple/Thin borders
                textColor: [0, 0, 0],
                cellPadding: 1
            },
            headStyles: { fillColor: [255, 255, 255] },
            columnStyles: {
                0: { cellWidth: 30 },
                1: { cellWidth: 'auto' }, // Remainder
                2: { cellWidth: 40 }
            },
            margin: { left: margin, right: margin },
            tableWidth: pageWidth - (2 * margin)
        });

        finalY = (doc as any).lastAutoTable.finalY;

        // --- UBICACIÓN ---
        autoTable(doc, {
            body: [
                [
                    { content: `SEDE: ${hojaVida.equipo?.servicios?.sede?.nombres || ''}`, styles: { halign: 'center', fontStyle: 'bold' } },
                    { content: `SERVICIO: ${hojaVida.equipo?.servicios?.nombres || ''}`, styles: { halign: 'center', fontStyle: 'bold' } },
                    { content: `UBICACIÓN: ${hojaVida.equipo?.ubicacion || ''}`, styles: { halign: 'center', fontStyle: 'bold' } }
                ]
            ],
            theme: 'grid',
            styles: { lineColor: [0, 0, 0], lineWidth: 0.1, textColor: [0, 0, 0], fontSize: 9 },
            headStyles: { fillColor: [0, 150, 136], textColor: [255, 255, 255] }, // Teal Green
            margin: { left: margin, right: margin },
            startY: finalY + 2
        });
        finalY = (doc as any).lastAutoTable.finalY + 2;

        // --- SECCIÓN 1: IDENTIFICACIÓN - ADQUISICIÓN - RIESGO - FOTO (SEPARATE TABLES) ---
        const startY_Sec1 = finalY;
        let cursorX_Sec1 = margin;
        const gap_Sec1 = 3;

        // 1a. IDENTIFICACIÓN DEL EQUIPO
        const widthIdent = 84;
        const identData = [
            ['NOMBRE', hojaVida.equipo?.nombres || ''],
            ['MARCA', hojaVida.equipo?.marca || ''],
            ['MODELO', hojaVida.equipo?.modelo || ''],
            ['SERIE', hojaVida.equipo?.serie || ''],
            ['ACTIVO FIJO', hojaVida.equipo?.placa || ''],
            ['REG. INVIMA', hojaVida.equipo?.registroInvima || ''],
            ['FABRICANTE', hojaVida.fabricante?.nombres || '']
        ];

        autoTable(doc, {
            head: [[{ content: 'IDENTIFICACIÓN DEL EQUIPO', colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }]],
            body: identData,
            startY: startY_Sec1,
            margin: { left: cursorX_Sec1 },
            tableWidth: widthIdent,
            theme: 'grid',
            styles: { fontSize: 6, lineColor: [0, 0, 0], lineWidth: 0.1, textColor: [0, 0, 0], cellPadding: 1, valign: 'middle' },
            headStyles: { fillColor: [0, 150, 136], textColor: [255, 255, 255], lineWidth: 0.1, fontSize: 7 },
            columnStyles: {
                0: { cellWidth: 25, fontStyle: 'bold' },
                1: { cellWidth: 59 }
            }
        });
        const finalY_Ident = (doc as any).lastAutoTable.finalY;
        cursorX_Sec1 += widthIdent + gap_Sec1;

        // 1b. DATOS DE ADQUISICIÓN
        const widthAdq = 84;
        const adqData = [
            ['PROVEEDOR', hojaVida.proveedor?.nombres || ''],
            ['TELÉFONO', hojaVida.proveedor?.telefono || ''],
            ['CORREO', hojaVida.proveedor?.email || ''],
            ['CONTRATO Nº', hojaVida.contrato || ''],
            ['FECHA ADQ', this.formatDate(hojaVida.fechaCompra)],
            ['FECHA INST', this.formatDate(hojaVida.fechaInstalacion)],
            ['VENC GTIA', this.formatDate(hojaVida.fechaVencimientoGarantia)],
            ['COSTO', hojaVida.costoCompra || '']
        ];

        autoTable(doc, {
            head: [[{ content: 'DATOS DE ADQUISICIÓN', colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }]],
            body: adqData,
            startY: startY_Sec1,
            margin: { left: cursorX_Sec1 },
            tableWidth: widthAdq,
            theme: 'grid',
            styles: { fontSize: 6, lineColor: [0, 0, 0], lineWidth: 0.1, textColor: [0, 0, 0], cellPadding: 1, valign: 'middle' },
            headStyles: { fillColor: [0, 150, 136], textColor: [255, 255, 255], lineWidth: 0.1, fontSize: 7 },
            columnStyles: {
                0: { cellWidth: 25, fontStyle: 'bold' },
                1: { cellWidth: 59 }
            }
        });
        const finalY_Adq = (doc as any).lastAutoTable.finalY;
        cursorX_Sec1 += widthAdq + gap_Sec1;

        // 1c. CLASIFICACIÓN DE RIESGO
        // Prepare risk data rows
        const check = (val: boolean) => val ? 'X' : '';
        const riesgo = hojaVida.equipo?.riesgo;
        const widthRiesgo = 30;
        const riesgoBody = [
            ['I', check(riesgo === 'I')],
            ['IIA', check(riesgo === 'IIA')],
            ['IIB', check(riesgo === 'IIB')],
            ['III', check(riesgo === 'III')],
            ['NA', check(riesgo === 'NA')],
            ['', ''], // Empty rows to match height if needed, keeping simple for now
            ['', ''],
            ['', '']
        ];

        autoTable(doc, {
            head: [[{ content: 'CLAS. RIESGO', colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }]],
            body: riesgoBody,
            startY: startY_Sec1,
            margin: { left: cursorX_Sec1 },
            tableWidth: widthRiesgo,
            theme: 'grid',
            styles: { fontSize: 6, lineColor: [0, 0, 0], lineWidth: 0.1, textColor: [0, 0, 0], cellPadding: 1, valign: 'middle' },
            headStyles: { fillColor: [0, 150, 136], textColor: [255, 255, 255], lineWidth: 0.1, fontSize: 7 },
            columnStyles: {
                0: { halign: 'center', cellWidth: 10, fontStyle: 'bold' },
                1: { halign: 'center', cellWidth: 20 }
            }
        });
        const finalY_Riesgo = (doc as any).lastAutoTable.finalY;
        cursorX_Sec1 += widthRiesgo + gap_Sec1;

        // 1d. FOTOGRAFÍA (Manually placed image)
        // Draw image in the remaining space
        if (equipoImg) {
            // Calculate max height based on the tallest table
            const availableHeight = Math.max(finalY_Ident, finalY_Adq, finalY_Riesgo) - startY_Sec1;
            const cellX = cursorX_Sec1 + 2;
            const availableWidth = pageWidth - margin - cellX;

            // Reduce size by 20% (scale 0.8)
            const imgWidth = availableWidth * 0.8;
            const imgHeight = availableHeight * 0.8;

            // Center image in the available space
            const imgX = cellX + (availableWidth - imgWidth) / 2;
            const imgY = startY_Sec1 + (availableHeight - imgHeight) / 2;

            doc.addImage(equipoImg, 'JPEG', imgX, imgY, imgWidth, imgHeight);
        }

        finalY = Math.max(finalY_Ident, finalY_Adq, finalY_Riesgo) + 2;


        // --- SECCIÓN 2: GRID FOR REGISTRO TÉCNICO ETC ---
        const startY_Sec2 = finalY;
        const dt = hojaVida.datosTecnicos || {};
        const gap = 3;
        let cursorX = margin;

        // 2a. REGISTRO TÉCNICO (Use internal columns)
        const widthRegTec = 96;
        const regTecBody = [
            ['TENSIÓN MÁX', `${dt.tensionMaxima || ''} V`, 'PRESIÓN', `${dt.presion || ''} psi`],
            ['TENSIÓN MÍN', `${dt.tensionMinima || ''} V`, 'VELOCIDAD', `${dt.velocidad || ''} RPM`],
            ['CORRIENTE MÁX', `${dt.corrienteMaxima || ''} A`, 'TEMP', `${dt.temperatura || ''} °C`],
            ['CORRIENTE MÍN', `${dt.corrienteMinima || ''} A`, 'PESO', `${dt.peso || ''} kg`],
            ['POTENCIA', `${dt.potenciaConsumo || ''} W`, 'CAPACIDAD', `${dt.capacidad || ''} L`],
            ['FRECUENCIA', `${dt.frecuencia || ''} Hz`, 'OTROS', `${dt.otros || ''}`]
        ];

        autoTable(doc, {
            head: [[{ content: 'REGISTRO TÉCNICO', colSpan: 4, styles: { halign: 'center', fontStyle: 'bold' } }]],
            body: regTecBody,
            startY: startY_Sec2,
            margin: { left: cursorX },
            tableWidth: widthRegTec,
            theme: 'grid',
            styles: { fontSize: 6, lineColor: [0, 0, 0], lineWidth: 0.1, textColor: [0, 0, 0], cellPadding: 1 },
            headStyles: { fillColor: [0, 150, 136], textColor: [255, 255, 255], lineWidth: 0.1, fontSize: 7 },
            columnStyles: {
                0: { cellWidth: 20, fontStyle: 'bold' },
                1: { cellWidth: 28 },
                2: { cellWidth: 15, fontStyle: 'bold' },
                3: { cellWidth: 33 }
            }
        });
        const finalY_RegTec = (doc as any).lastAutoTable.finalY;
        cursorX += widthRegTec + gap;

        // 2b. TIPO DE TECNOLOGÍA
        const widthTipo = 42;
        const tipoTec = hojaVida.clase;
        const tipoTecBody = [
            ['ELÉCTRICO', check(tipoTec === 'Electrico')],
            ['ELECTRÓNICO', check(tipoTec === 'Electronico')],
            ['MECÁNICO', check(tipoTec === 'Mecanico')],
            ['NEUMÁTICO', check(tipoTec === 'Neumatico')],
            ['OTRO', check(!['Electrico', 'Electronico', 'Mecanico', 'Neumatico'].includes(tipoTec) && !!tipoTec)]
        ];

        autoTable(doc, {
            head: [[{ content: 'TIPO TECNOLOGÍA', colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }]],
            body: tipoTecBody,
            startY: startY_Sec2,
            margin: { left: cursorX },
            tableWidth: widthTipo,
            theme: 'grid',
            styles: { fontSize: 6, lineColor: [0, 0, 0], lineWidth: 0.1, textColor: [0, 0, 0], cellPadding: 1 },
            headStyles: { fillColor: [0, 150, 136], textColor: [255, 255, 255], lineWidth: 0.1, fontSize: 7 },
            columnStyles: {
                0: { fontStyle: 'bold' },
                1: { halign: 'center', cellWidth: 8, fontStyle: 'bold' }
            }
        });
        const finalY_Tipo = (doc as any).lastAutoTable.finalY;
        cursorX += widthTipo + gap;

        // 2c. DOCUMENTOS DISPONIBLES
        const widthDocs = 42;
        const docsBody = [
            ['MANUAL USUARIO', '[   ]'],
            ['MANUAL SERVICIO', '[   ]'],
            ['FICHA TÉCNICA', '[   ]'],
            ['GUÍA RÁPIDA', '[   ]']
        ];

        autoTable(doc, {
            head: [[{ content: 'DOCUMENTOS', colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }]],
            body: docsBody,
            startY: startY_Sec2,
            margin: { left: cursorX },
            tableWidth: widthDocs,
            theme: 'grid',
            styles: { fontSize: 6, lineColor: [0, 0, 0], lineWidth: 0.1, textColor: [0, 0, 0], cellPadding: 1 },
            headStyles: { fillColor: [0, 150, 136], textColor: [255, 255, 255], lineWidth: 0.1, fontSize: 7 },
            columnStyles: {
                0: { fontStyle: 'bold' },
                1: { halign: 'center', cellWidth: 8, fontStyle: 'bold' }
            }
        });
        const finalY_Docs = (doc as any).lastAutoTable.finalY;
        cursorX += widthDocs + gap;

        // 2d. CLASIFICACIÓN SEGÚN USO
        // Width = Page (297) - 20 (margins) - 96 - 42 - 42 - 9 (gaps) = ~88
        const widthUso = 88;
        const uso = hojaVida.tipoUso;
        const usoBody = [
            ['DIAGNÓSTICO', check(uso === 'Diagnostico')],
            ['TERAPÉUTICO', check(uso === 'Terapéutico')],
            ['SOPORTE VITAL', check(uso === 'Soporte Vital')],
            ['QUIRÚRGICO', check(uso === 'Quirurgico')],
            ['LABORATORIO', check(uso === 'Equipo de laboratorio')],
            ['REHABILITACIÓN', check(uso === 'Rehabilitación')],
            ['GESTIÓN/SOPORTE', check(uso === 'Gestión y Soporte Hospitalario')]
        ];

        autoTable(doc, {
            head: [[{ content: 'CLASIFICACIÓN SEGÚN USO', colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }]],
            body: usoBody,
            startY: startY_Sec2,
            margin: { left: cursorX },
            tableWidth: widthUso,
            theme: 'grid',
            styles: { fontSize: 6, lineColor: [0, 0, 0], lineWidth: 0.1, textColor: [0, 0, 0], cellPadding: 1 },
            headStyles: { fillColor: [0, 150, 136], textColor: [255, 255, 255], lineWidth: 0.1, fontSize: 7 },
            columnStyles: {
                0: { fontStyle: 'bold' },
                1: { halign: 'center', cellWidth: 10, fontStyle: 'bold' }
            }
        });
        const finalY_Uso = (doc as any).lastAutoTable.finalY;

        finalY = Math.max(finalY_RegTec, finalY_Tipo, finalY_Docs, finalY_Uso) + 2;

        // --- SECCIÓN 3: CONTROL, PERIODICIDAD Y ACCESORIOS (SPLIT TABLES) ---
        // 3a. RESPONSABLE MMTO
        const mnt = hojaVida.mantenimiento;
        const respMntBody = [
            ['PROPIO', check(mnt === 'Propio')],
            ['CONTRATADO', check(mnt === 'Contratado')],
            ['COMODATO', check(mnt === 'Comodato')],
            ['GARANTÍA', check(mnt === 'Garantia')],
            ['ALQUILER', check(mnt === 'Alquiler')]
        ];

        const startY_Sec3 = finalY;

        autoTable(doc, {
            head: [[{ content: 'RESPONSABLE MMTO', colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }]],
            body: respMntBody,
            startY: startY_Sec3,
            margin: { left: margin },
            tableWidth: 40,
            theme: 'grid',
            styles: { fontSize: 6, lineColor: [0, 0, 0], lineWidth: 0.1, textColor: [0, 0, 0], cellPadding: 1 },
            headStyles: { fillColor: [0, 150, 136], textColor: [255, 255, 255], fontSize: 7 },
            columnStyles: { 1: { halign: 'center', fontStyle: 'bold' } }
        });
        const finalY_Resp = (doc as any).lastAutoTable.finalY;

        // 3b. PERIODICIDAD MMTO
        const pMnt = hojaVida.equipo?.periodicidadM;
        const perMntBody = [
            ['CUATRIMESTRAL', check(pMnt === 4)],
            ['SEMESTRAL', check(pMnt === 6)],
            ['ANUAL', check(pMnt === 12)],
            ['BIANUAL', check(pMnt === 24)],
            ['NO APLICA', check(pMnt === 0)]
        ];

        autoTable(doc, {
            head: [[{ content: 'PERIODICIDAD MMTO', colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }]],
            body: perMntBody,
            startY: startY_Sec3,
            margin: { left: margin + 42 },
            tableWidth: 40,
            theme: 'grid',
            styles: { fontSize: 6, lineColor: [0, 0, 0], lineWidth: 0.1, textColor: [0, 0, 0], cellPadding: 1 },
            headStyles: { fillColor: [0, 150, 136], textColor: [255, 255, 255], fontSize: 7 },
            columnStyles: { 1: { halign: 'center', fontStyle: 'bold' } }
        });
        const finalY_PerMnt = (doc as any).lastAutoTable.finalY;

        // 3c. PERIODICIDAD CALIBRACIÓN
        const pCal = hojaVida.equipo?.periodicidadC;
        const perCalBody = [
            ['SEMESTRAL', check(pCal === 6)],
            ['ANUAL', check(pCal === 12)],
            ['BIANUAL', check(pCal === 24)],
            ['NO APLICA', check(pCal === 0)]
        ];

        autoTable(doc, {
            head: [[{ content: 'PERIODICIDAD CAL', colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }]],
            body: perCalBody,
            startY: startY_Sec3,
            margin: { left: margin + 42 + 42 },
            tableWidth: 40,
            theme: 'grid',
            styles: { fontSize: 6, lineColor: [0, 0, 0], lineWidth: 0.1, textColor: [0, 0, 0], cellPadding: 1 },
            headStyles: { fillColor: [0, 150, 136], textColor: [255, 255, 255], fontSize: 7 },
            columnStyles: { 1: { halign: 'center', fontStyle: 'bold' } }
        });
        const finalY_PerCal = (doc as any).lastAutoTable.finalY;

        // 3d. ACCESORIOS
        const accesoriosContent = dt.accesorios || '\n\n\n\n';

        autoTable(doc, {
            head: [[{ content: 'ACCESORIOS DEL EQUIPO', styles: { halign: 'center', fontStyle: 'bold' } }]],
            body: [
                [{ content: accesoriosContent, styles: { minCellHeight: 20 } }]
            ],
            startY: startY_Sec3,
            margin: { left: margin + 42 + 42 + 42 },
            tableWidth: 151, // Remainder
            theme: 'grid',
            styles: { fontSize: 7, lineColor: [0, 0, 0], lineWidth: 0.1, textColor: [0, 0, 0] },
            headStyles: { fillColor: [0, 150, 136], textColor: [255, 255, 255], fontSize: 7 }
        });
        const finalY_Acc = (doc as any).lastAutoTable.finalY;

        finalY = Math.max(finalY_Resp, finalY_PerMnt, finalY_PerCal, finalY_Acc);

        // --- OBSERVACIONES ---
        autoTable(doc, {
            head: [
                [{ content: 'OBSERVACIONES', styles: { halign: 'center', fontStyle: 'bold' } }]
            ],
            body: [
                [{ content: hojaVida.observaciones || '\n\n\n' }]
            ],
            theme: 'grid',
            styles: { lineColor: [0, 0, 0], lineWidth: 0.1, textColor: [0, 0, 0] },
            headStyles: { fillColor: [0, 150, 136], textColor: [255, 255, 255] },
            margin: { left: margin, right: margin },
            startY: finalY + 5
        });

        // Footer
        const footerY = pageHeight - 10;
        doc.setFontSize(6);
        doc.text('ND: NO DISPONIBLE   NR: NO REGISTRA   NE: NO ESPECIFICA   NA: NO APLICA', margin, footerY);

        doc.save(`HojaVida_${hojaVida.equipo?.placa || 'Equipo'}.pdf`);
    }

    private formatDate(dateStr: string): string {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('es-CO');
    }

    private async blobToBase64(blob: Blob): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    private async loadImage(url: string): Promise<string | null> {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                console.warn(`Failed to load image from ${url}: ${response.status} ${response.statusText}`);
                return null;
            }
            const blob = await response.blob();
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } catch (e) {
            console.error('Error loading image', e);
            return null;
        }
    }
}
