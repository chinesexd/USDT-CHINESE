import pandas as pd
import streamlit as st

# Función para cargar los datos y mostrar una vista previa
def cargar_y_mostrar_vista_previa(archivo_excel):
    df = pd.read_excel(archivo_excel)
    st.title(f"Vista Previa de Datos de {archivo_excel.name}")
    
    # Mostrar información sobre el DataFrame
    st.write(f"**Número de Filas:** {df.shape[0]}")
    st.write(f"**Número de Columnas:** {df.shape[1]}")
    
    # Mostrar el DataFrame completo
    st.write("**DataFrame Completo:**")
    st.write(df)
    
    return df

# Función para copiar la información de "Member Number" y "Member First Name"
def copiar_informacion_miembro(df_original, df_destino):
    # Copiar la información de "Member Number" y "Member First Name" del primer DataFrame al segundo
    df_destino['Member Number'] = df_original['Member Number']
    df_destino['FIRST NAME'] = df_original['Member First Name']
    df_destino['LAsT NAME'] = df_original['Member Last Name']
    df_destino['DOB'] = pd.to_datetime(df_original['Member DOB'], errors='coerce').dt.strftime('%m/%d/%Y')
    df_destino['Sex'] = df_original['Member Gender']
    df_destino[' Language'] = df_original['Member Language']
    df_destino['Member Phone Number'] = df_original['Member Phone Number']
    df_destino['Work Phone'] = df_original['Member Phone Number']
    df_destino['Other Phone'] = df_original['Member Other Phone']
    df_destino[' Email'] = df_original['Member Email']
    df_destino['Measure'] = df_original['Measure']
    df_destino['Medication_1'] = df_original['Medication_1']
    df_destino['Medication_2'] = df_original['Medication_2']
    df_destino['Medication_3'] = df_original['Medication_3']
    df_destino['Days Adherent'] = df_original['Days Adherent']
    df_destino['Numerator Hit'] = df_original['Numerator Hit']
    df_destino['PDC %  Compliant'] = df_original['PDC']
    df_destino['Ability to Make Member Compliant'] = df_original['Ability to Make Member Compliant']
    df_destino['Total Days'] = df_original['Total Days']
    df_destino['Minimum Days for 80 PCT'] = df_original['Minimum Days for 80 PCT']
    df_destino['Medication 1 Pharmacy'] = df_original['Medication 1 Pharmacy']
    df_destino['Med 1 Pharmacy Phone'] = df_original['Medication 1 Pharmacy Phone']
    df_destino['Med 1 Date of Service'] = pd.to_datetime(df_original['Medication 1 Date of Service'], errors='coerce').dt.strftime('%m/%d/%Y')
    df_destino['Med 1 Days Supply'] = df_original['Medication 1 Days Supply']
    df_destino['Med1 Drug Quantity'] = df_original['Medication 1 Drug Quantity']
    df_destino['Med 1 Refills Remaining'] = df_original['Medication 1 Refills Remaining']
    df_destino['Med 1 Refill Date'] = pd.to_datetime(df_original['Medication 1 Refill Date'], errors='coerce').dt.strftime('%m/%d/%Y')
    df_destino['Med 2 Pharmacy'] = df_original['Medication 2 Pharmacy']
    df_destino['Med 2 Date of Service'] = pd.to_datetime(df_original['Medication 2 Date of Service'], errors='coerce').dt.strftime('%m/%d/%Y')
    df_destino['Med 2 Days Supply'] = df_original['Medication 2 Days Supply']
    df_destino['Med 2 Drug Quantity'] = df_original['Medication 2 Drug Quantity']
    df_destino['Med 2 Refills Remaining'] = df_original['Medication 2 Refills Remaining']
    df_destino['Med 2 Refill Date'] = pd.to_datetime(df_original['Medication 2 Refill Date'], errors='coerce').dt.strftime('%m/%d/%Y')
    df_destino['Med 2 Pharmacy Phone'] = df_original['Medication 2 Pharmacy Phone']
    df_destino['Med 3 Pharmacy'] = df_original['Medication 3 Pharmacy']
    df_destino['Med 3 Date of Service'] = pd.to_datetime(df_original['Medication 3 Date of Service'], errors='coerce').dt.strftime('%m/%d/%Y')
    df_destino['Med 3 Days Supply'] = df_original['Medication 3 Days Supply']
    df_destino['Med 3 Drug Quantity'] = df_original['Medication 3 Drug Quantity']
    df_destino['Med 3 Refills Remaining'] = df_original['Medication 3 Refills Remaining']
    df_destino['Med 3 Refill Date'] = pd.to_datetime(df_original['Medication 3 Refill Date'], errors='coerce').dt.strftime('%m/%d/%Y')
    df_destino['Med 3 Pharmacy Phone'] = df_original['Medication 3 Pharmacy Phone']
    df_destino['Member Queued'] = df_original['Member Queued']
    df_destino['Outreach Result'] = df_original['Outreach Result']
    return df_destino

# Interfaz de usuario con Streamlit
st.title("Actualización de Datos")

# Widget para cargar el primer archivo Excel
primer_archivo = st.file_uploader("Seleccionar el primer archivo Excel", type=["xlsx"])
df_original = None

# Widget para cargar el segundo archivo Excel
segundo_archivo = st.file_uploader("Seleccionar el segundo archivo Excel", type=["xlsx"])
df_destino = None

# Verificar si ambos archivos han sido cargados
if primer_archivo and segundo_archivo:
    # Cargar y mostrar vista previa de datos del primer archivo
    df_original = cargar_y_mostrar_vista_previa(primer_archivo)

    # Cargar y mostrar vista previa de datos del segundo archivo
    df_destino = cargar_y_mostrar_vista_previa(segundo_archivo)

    # Agregar botón para copiar información de "Member Number" y "Member First Name"
    if st.button("Actualizar :)'"):
        # Realizar la copia de información
        df_destino = copiar_informacion_miembro(df_original, df_destino)

        # Mostrar la vista previa actualizada del segundo DataFrame
        st.title("Vista Previa Actualizada del Segundo Excel")
        st.dataframe(df_destino)
