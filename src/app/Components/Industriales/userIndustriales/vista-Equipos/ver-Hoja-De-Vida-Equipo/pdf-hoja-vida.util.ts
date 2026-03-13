import jsPDF from 'jspdf';

/**
 * Replica exacta del formato de hojaVida.js (pdfkit) pero usando jsPDF en el frontend.
 * Layout: LETTER portrait, drawCell() celda por celda con rect + text.
 */

const v = (val: any, fb = 'NR') => (val != null && val !== '') ? String(val) : fb;
const fmtDate = (d: any) => { if (!d) return 'NR'; try { return new Date(d).toLocaleDateString('es-CO'); } catch { return 'NR'; } };
const chk = (c: boolean) => c ? 'X' : '';

function drawCell(doc: jsPDF, text: string, x: number, y: number, w: number, h: number, opts: any = {}) {
    const { align = 'left', bold = false, fontSize = 7 } = opts;
    // Border
    doc.setLineWidth(0.3);
    doc.rect(x, y, w, h);
    if (text) {
        doc.setFontSize(fontSize);
        doc.setFont('helvetica', bold ? 'bold' : 'normal');
        const padding = 1;
        const maxW = w - padding * 2;
        const lines = doc.splitTextToSize(text, maxW);
        const lineH = fontSize * 0.4;
        const totalTextH = lines.length * lineH;
        let textY = y + (h - totalTextH) / 2 + lineH * 0.8;
        if (textY < y + padding) textY = y + padding + lineH * 0.5;
        const textX = align === 'center' ? x + w / 2 : x + padding;
        doc.text(lines, textX, textY, { align: align as any, maxWidth: maxW });
    }
}

// Conversión: hojaVida.js usa puntos (1pt ≈ 0.353mm). Letter=612x792pt → 216x279mm
// La escala factor: pageW en hojaVida.js ≈ 572pt. En mm ≈ 200mm. Factor ≈ 0.35
const S = 0.35; // scale factor pt→mm

export function generarHojaVidaPDF(equipoInfo: any, hojaVida: any, datosTecnicos: any, proveedor: any, registroApoyo: any) {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' });
    const pageW = doc.internal.pageSize.getWidth(); // ~216mm
    const margins = { top: 7, left: 7, right: 7 };
    const W = pageW - margins.left - margins.right; // ~202mm
    const startX = margins.left;
    let Y = margins.top;
    const dc = (t: string, x: number, y: number, w: number, h: number, o: any = {}) => drawCell(doc, t, x, y, w, h, o);
    const rowH = 4.2;

    // ── ENCABEZADO (3 columnas) ──
    const hCol1 = 28; // código/versión
    const hCol3 = 28; // logo/fecha
    const hCenter = W - hCol1 - hCol3;

    dc(`CÓDIGO\nIB-F-25`, startX, Y, hCol1, 9, { align: 'center', bold: true, fontSize: 6 });
    dc(`VERSIÓN: 02`, startX, Y + 9, hCol1, 9, { align: 'center', bold: true, fontSize: 6 });

    dc('E.S.E HOSPITAL UNIVERSITARIO SAN RAFAEL DE TUNJA', startX + hCol1, Y, hCenter, 6, { align: 'center', bold: true, fontSize: 8 });
    dc('III NIVEL DE ATENCIÓN', startX + hCol1, Y + 6, hCenter, 5.5, { align: 'center', fontSize: 7 });
    dc('HOJA DE VIDA EQUIPO INDUSTRIAL\nHRCATCH', startX + hCol1, Y + 11.5, hCenter, 6.5, { align: 'center', bold: true, fontSize: 6 });

    dc('', startX + hCol1 + hCenter, Y, hCol3, 11, { align: 'center' }); // logo placeholder
    dc(`Fecha: ${fmtDate(new Date())}`, startX + hCol1 + hCenter, Y + 11, hCol3, 7, { align: 'center', fontSize: 5 });

    Y += 20;

    // ── IDENTIFICACIÓN ──
    dc('IDENTIFICACIÓN', startX, Y, W, 4.5, { align: 'center', bold: true, fontSize: 7 });
    Y += 4.5;

    const photoW = 35;
    const dataW = W - photoW;

    dc('DEPARTAMENTO:', startX, Y, 33, rowH, { bold: true, fontSize: 5 });
    dc('BOYACÁ', startX + 33, Y, 45, rowH, { fontSize: 5 });
    dc('MUNICIPIO:', startX + 78, Y, 27, rowH, { bold: true, fontSize: 5 });
    dc('TUNJA', startX + 105, Y, dataW - 105, rowH, { fontSize: 5 });
    // Photo area
    doc.rect(startX + dataW, Y, photoW, rowH * 4);
    doc.setFontSize(5); doc.text('FOTO', startX + dataW + photoW / 2, Y + rowH * 2, { align: 'center' });

    Y += rowH;
    dc('DIRECCIÓN:', startX, Y, 33, rowH, { bold: true, fontSize: 5 });
    dc(v(equipoInfo?.sedeInd?.nombres), startX + 33, Y, 72, rowH, { fontSize: 5 });
    dc('TELÉFONO:', startX + 105, Y, 25, rowH, { bold: true, fontSize: 5 });
    dc('NR', startX + 130, Y, dataW - 130, rowH, { fontSize: 5 });

    Y += rowH;
    dc('SERVICIO:', startX, Y, 33, rowH, { bold: true, fontSize: 5 });
    dc(v(equipoInfo?.servicioInd?.nombres), startX + 33, Y, 72, rowH, { fontSize: 5 });
    dc('UBICACIÓN:', startX + 105, Y, 25, rowH, { bold: true, fontSize: 5 });
    dc(v(equipoInfo?.ubicacionEspecifica), startX + 130, Y, dataW - 130, rowH, { fontSize: 5 });

    Y += rowH;
    dc('RESPONSABLE:', startX, Y, 33, rowH, { bold: true, fontSize: 5 });
    dc(v(equipoInfo?.responsableInd?.nombres), startX + 33, Y, dataW - 33, rowH, { fontSize: 5 });

    Y += rowH + 2;

    // ── DATOS DEL EQUIPO | FORMA DE ADQUISICIÓN | DATOS DE LA COMPRA ──
    const col1W = 49;  // datos equipo
    const col2W = 32;  // adquisición
    const col3W = (W - col1W - col2W) / 2; // compra
    const col4W = col3W; // proveedor

    dc('DATOS DEL EQUIPO', startX, Y, col1W, 4.5, { bold: true, fontSize: 6 });
    dc('FORMA DE\nADQUISICIÓN', startX + col1W, Y, col2W, 4.5, { bold: true, align: 'center', fontSize: 4 });
    dc('DATOS DE LA COMPRA', startX + col1W + col2W, Y, col3W + col4W, 4.5, { bold: true, align: 'center', fontSize: 6 });
    Y += 4.5;

    const adq = v(hojaVida?.adquisicion, '');
    const eqRows = [
        { l1: 'EQUIPO:', v1: v(equipoInfo?.nombres), l2: 'COMPRA:', v2: adq === 'compra', l3: 'F. COMPRA:', v3: fmtDate(hojaVida?.fechaCompra), l4: 'PROVEEDOR:', v4: v(proveedor?.codigoEquipo) },
        { l1: 'MARCA:', v1: v(equipoInfo?.marca), l2: 'DONADO:', v2: adq === 'donado', l3: 'F. INSTAL:', v3: fmtDate(hojaVida?.fechaInstalacion), l4: 'TEL. PROV:', v4: v(proveedor?.telefonoRepresentante) },
        { l1: 'MODELO:', v1: v(equipoInfo?.modelo), l2: 'CONVENIO:', v2: adq === 'convenio', l3: 'F. OPERAC:', v3: fmtDate(hojaVida?.fechaInicioOperacion), l4: 'CIUDAD:', v4: v(proveedor?.ciudadFabricante) },
        { l1: 'SERIE:', v1: v(equipoInfo?.serie), l2: 'MINISTERIO:', v2: adq === 'asignado por ministerio', l3: 'F. GARANTÍA:', v3: fmtDate(hojaVida?.vencimientoGarantia), l4: 'REPRESEN:', v4: v(proveedor?.representante) },
        { l1: 'INVENTARIO:', v1: v(equipoInfo?.placa), l2: 'GOBERNACION:', v2: adq === 'asignado por gobernación', l3: 'FABRICANTE:', v3: v(proveedor?.fabricante), l4: 'TEL. REP:', v4: v(proveedor?.telefonoDistribuidor) },
        { l1: 'TIPO EQUIPO:', v1: v(equipoInfo?.tipoEquipoInd?.nombres), l2: 'COMODATO:', v2: adq === 'comodato', l3: 'COSTO:', v3: v(hojaVida?.costoCompra), l4: 'CONTRATO:', v4: v(hojaVida?.contrato) },
    ];

    eqRows.forEach(r => {
        dc(r.l1, startX, Y, 18, rowH, { fontSize: 4.5, bold: true });
        dc(r.v1, startX + 18, Y, col1W - 18, rowH, { fontSize: 4.5 });
        dc(r.l2, startX + col1W, Y, col2W - 7, rowH, { fontSize: 4 });
        dc(r.v2 === true ? 'X' : '', startX + col1W + col2W - 7, Y, 7, rowH, { align: 'center', fontSize: 5 });
        dc(r.l3, startX + col1W + col2W, Y, 21, rowH, { fontSize: 4 });
        dc(r.v3, startX + col1W + col2W + 21, Y, col3W - 21, rowH, { fontSize: 4.5 });
        dc(r.l4, startX + col1W + col2W + col3W, Y, 21, rowH, { fontSize: 4 });
        dc(r.v4, startX + col1W + col2W + col3W + 21, Y, col4W - 21, rowH, { fontSize: 4.5 });
        Y += rowH;
    });

    Y += 2;

    // ── REGISTRO TÉCNICO | FUENTE DE ALIMENTACIÓN | REGISTRO DE APOYO ──
    const rtW = 95;
    const faW = 42;
    const raW = W - rtW - faW;
    const hdrH = 6;

    dc('REGISTRO TÉCNICO', startX, Y, rtW, hdrH, { bold: true, fontSize: 6 });
    dc('FUENTE DE\nALIMENTACIÓN:', startX + rtW, Y, faW, hdrH, { bold: true, fontSize: 5 });
    dc('REGISTRO DE APOYO\nTÉCNICO:', startX + rtW + faW, Y, raW, hdrH, { bold: true, fontSize: 5 });
    Y += hdrH;

    const dt = datosTecnicos;
    const ra = registroApoyo;
    const techRows = [
        ['VOLTAJE MÁX:', v(dt?.volMaxOperacion), 'V', 'VELOCIDAD:', v(dt?.velocidad), '', 'ELECTRICIDAD:', chk(dt?.electricidad), 'MANUALES', null],
        ['VOLTAJE MÍN:', v(dt?.volMinOperacion), 'V', 'PRESIÓN:', v(dt?.presion), '', 'ENERGÍA SOLAR:', chk(dt?.energiaSolar), 'MANUAL USUARIO:', ra?.manualUsuario],
        ['CORRIENTE MÁX:', v(dt?.corrienteMaxOperacion), 'A', 'TEMPERATURA:', v(dt?.temperatura), '°C', 'AGUA:', chk(dt?.agua), 'MANUAL TÉCNICO:', ra?.manualTecnico],
        ['CORRIENTE MÍN:', v(dt?.corrienteMinOperacion), 'A', 'PESO:', v(dt?.peso), 'Kg', 'VAPOR:', chk(dt?.vapor), 'USO', null],
        ['POTENCIA:', v(dt?.potenciaConsumida), 'W', 'CAPACIDAD:', v(dt?.capacidad), '', 'DERIVADOS PETRÓLEO:', chk(dt?.derivadoPetroleo), v(ra?.uso, 'NR'), null],
        ['FRECUENCIA:', v(dt?.frecuencia), 'Hz', 'OTROS:', v(dt?.otros), '', 'AIRE:', chk(dt?.aire), 'RIESGO:', v(ra?.riesgo)],
        ['PORTÁTIL:', hojaVida?.equipoPortatil ? 'SÍ' : 'NO', '', 'FIJO:', !hojaVida?.equipoPortatil ? 'SÍ' : 'NO', '', 'OTROS:', '', 'ESTADO:', v(ra?.estado)]
    ];

    techRows.forEach(r => {
        dc(String(r[0]), startX, Y, 21, rowH, { fontSize: 4 });
        dc(String(r[1]), startX + 21, Y, 11, rowH, { fontSize: 4 });
        dc(String(r[2]), startX + 32, Y, 7, rowH, { fontSize: 4, align: 'center' });
        dc(String(r[3]), startX + 39, Y, 21, rowH, { fontSize: 4 });
        dc(String(r[4]), startX + 60, Y, 11, rowH, { fontSize: 4 });
        dc(String(r[5]), startX + 71, Y, 24, rowH, { fontSize: 4, align: 'center' });
        // Fuente
        dc(String(r[6]), startX + rtW, Y, faW - 10, rowH, { fontSize: 4 });
        dc(String(r[7]) === 'X' ? 'X' : '', startX + rtW + faW - 10, Y, 10, rowH, { align: 'center', fontSize: 5 });
        // Apoyo
        if (r[9] === null && r[8] !== '') {
            dc(String(r[8]), startX + rtW + faW, Y, raW, rowH, { fontSize: 4.5, bold: true });
        } else {
            dc(String(r[8]), startX + rtW + faW, Y, raW - 10, rowH, { fontSize: 4 });
            dc(r[9] === true ? 'X' : (r[9] !== null ? String(r[9]) : ''), startX + rtW + faW + raW - 10, Y, 10, rowH, { align: 'center', fontSize: 4.5 });
        }
        Y += rowH;
    });

    Y += 2;

    // ── CLASE DE TECNOLOGÍA | RIESGO | PERIODICIDAD | MANTENIMIENTO ──
    const ctW = 70;
    const rskW = 14;
    const pmW = 39;
    const maW = W - ctW - rskW - pmW;
    const hdr2H = 5.5;

    dc('CLASE DE TECNOLOGÍA PREDOMINANTE:', startX, Y, ctW, hdr2H, { bold: true, fontSize: 5 });
    dc('RIESGO:', startX + ctW, Y, rskW, hdr2H, { bold: true, fontSize: 5 });
    dc('PERIODICIDAD DEL\nMANTENIMIENTO:', startX + ctW + rskW, Y, pmW, hdr2H, { bold: true, fontSize: 4, align: 'center' });
    dc('MANTENIMIENTO\nACTUAL:', startX + ctW + rskW + pmW, Y, maW, hdr2H, { bold: true, fontSize: 5, align: 'center' });
    Y += hdr2H;

    const clase = v(hojaVida?.clase, '');
    const riesgo = v(equipoInfo?.riesgo, '');
    const mant = v(hojaVida?.mantenimiento, '');
    const perM = equipoInfo?.periodicidadM || 0;

    const classRows = [
        { ctL: 'ELÉCTRICO:', ctV: clase === 'Electrico', ctL2: 'ELECTRÓNICO:', ctV2: clase === 'Electronico', rL: 'I:', rV: riesgo === 'I', pmL: 'TRIMESTRAL:', pmV: perM === 3, maL: 'PROPIO:', maV: mant === 'Propio' },
        { ctL: 'MECÁNICO:', ctV: clase === 'Mecanico', ctL2: 'ELECTROMECÁN:', ctV2: clase === 'Electromecanico', rL: 'IIA:', rV: riesgo === 'IIA', pmL: 'CUATRIMES:', pmV: perM === 4, maL: 'CONTRATADO:', maV: mant === 'Contratado' },
        { ctL: 'HIDRÁULICO:', ctV: clase === 'Hidraulico', ctL2: 'NEUMÁTICO:', ctV2: clase === 'Neumatico', rL: 'IIB:', rV: riesgo === 'IIB', pmL: 'SEMESTRAL:', pmV: perM === 6, maL: 'COMODATO:', maV: mant === 'Comodato' },
        { ctL: 'VAPOR:', ctV: clase === 'Vapor', ctL2: 'SOLAR:', ctV2: clase === 'Solar', rL: 'III:', rV: riesgo === 'III', pmL: 'ANUAL:', pmV: perM === 12, maL: 'GARANTÍA:', maV: mant === 'Garantia' }
    ];

    classRows.forEach(r => {
        dc(r.ctL, startX, Y, 21, rowH, { fontSize: 4 });
        dc(chk(r.ctV), startX + 21, Y, 7, rowH, { align: 'center', fontSize: 5 });
        dc(r.ctL2, startX + 28, Y, 28, rowH, { fontSize: 4 });
        dc(chk(r.ctV2), startX + 56, Y, 7, rowH, { align: 'center', fontSize: 5 });
        dc('', startX + 63, Y, 7, rowH); // padding
        dc(r.rL, startX + ctW, Y, 7, rowH, { fontSize: 5 });
        dc(chk(r.rV), startX + ctW + 7, Y, 7, rowH, { align: 'center', fontSize: 5 });
        dc(r.pmL, startX + ctW + rskW, Y, 28, rowH, { fontSize: 4 });
        dc(chk(r.pmV), startX + ctW + rskW + 28, Y, 11, rowH, { align: 'center', fontSize: 5 });
        dc(r.maL, startX + ctW + rskW + pmW, Y, 32, rowH, { fontSize: 5 });
        dc(chk(r.maV), startX + ctW + rskW + pmW + 32, Y, maW - 32, rowH, { align: 'center', fontSize: 5 });
        Y += rowH;
    });

    Y += 2;

    // ── ACCESORIOS | CALIBRACIÓN/VALIDACIÓN ──
    const accW = W * 0.45;
    const clsW = W * 0.55;
    const s2 = startX + accW;
    let yA = Y, yC = Y;

    dc('ACCESORIOS DEL EQUIPO:', startX, yA, accW, 4.5, { bold: true, fontSize: 6 });
    yA += 4.5;
    const accTxt = v(dt?.accesorios, 'N/A');
    const accItems = accTxt.split(',').map((a: string) => a.trim());
    accItems.forEach((acc: string) => {
        dc(`• ${acc}`, startX, yA, accW, 3.5, { fontSize: 4.5 });
        yA += 3.5;
    });

    // Calibración
    dc('REQUIERE CALIBRACIÓN Y/O VALIDACIÓN:', s2, yC, clsW - 35, 4.5, { fontSize: 5, bold: true });
    dc('SI:', s2 + clsW - 35, yC, 10, 4.5, { fontSize: 5 });
    dc(chk(equipoInfo?.calibracion), s2 + clsW - 25, yC, 7, 4.5, { align: 'center', fontSize: 5 });
    dc('NO:', s2 + clsW - 18, yC, 10, 4.5, { fontSize: 5 });
    dc(chk(!equipoInfo?.calibracion), s2 + clsW - 8, yC, 8, 4.5, { align: 'center', fontSize: 5 });
    yC += 5;

    dc('CLASIFICACIÓN:', s2, yC, clsW, 4.5, { bold: true, fontSize: 6 });
    yC += 4.5;
    dc('CLASIFICACIÓN:', s2, yC, clsW / 2 - 10, rowH, { fontSize: 4.5 });
    dc(v(ra?.clasificacion), s2 + clsW / 2 - 10, yC, clsW / 2 + 10, rowH, { fontSize: 4.5 });
    yC += rowH;
    dc('TECNOLOGÍA:', s2, yC, clsW / 2 - 10, rowH, { fontSize: 4.5 });
    dc(v(ra?.tecnologiaPredominante), s2 + clsW / 2 - 10, yC, clsW / 2 + 10, rowH, { fontSize: 4.5 });
    yC += rowH;

    Y = Math.max(yA, yC) + 2;

    // ── PROPIEDAD DEL EQUIPO ──
    const prop = v(hojaVida?.propiedad, '');
    dc('PROPIEDAD DEL EQUIPO:', startX, Y, 42, rowH, { bold: true, fontSize: 5 });
    dc('HOSPITAL:', startX + 42, Y, 21, rowH, { fontSize: 5 });
    dc(chk(prop === 'Hospital'), startX + 63, Y, 7, rowH, { align: 'center', fontSize: 5 });
    dc('PROVEEDOR:', startX + 70, Y, 25, rowH, { fontSize: 5 });
    dc(chk(prop === 'Proveedor'), startX + 95, Y, 7, rowH, { align: 'center', fontSize: 5 });
    dc('OTRO:', startX + 102, Y, 18, rowH, { fontSize: 5 });
    dc(chk(prop === 'otro'), startX + 120, Y, 7, rowH, { align: 'center', fontSize: 5 });
    Y += rowH;

    // ── OBSERVACIONES ──
    dc('OBSERVACIONES:', startX, Y, 42, rowH, { bold: true, fontSize: 5 });
    dc(v(hojaVida?.observaciones, 'NA'), startX + 42, Y, W - 42, rowH, { fontSize: 5 });
    Y += rowH;

    // ── PIE ──
    dc('ND: NO DISPONIBLE   NR: NO REGISTRA   NE: NO ESPECIFICA   NA: NO APLICA', startX, Y, W, 3.5, { fontSize: 4, align: 'center' });

    return doc;
}
